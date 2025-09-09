import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db, giveaways, users } from '@/lib/db'
import { eq, desc, asc, and, or, like, gte, lte } from 'drizzle-orm'
import { requireAuth, requireAdmin } from '@/lib/auth'
import { successResponse, errorResponse, validationErrorResponse, handleApiError } from '@/lib/api-response'

const createGiveawaySchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(255, 'Title is too long'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  longDescription: z.string().optional(),
  prizeValue: z.string().min(1, 'Prize value is required').max(100, 'Prize value is too long'),
  maxEntries: z.number().int().positive('Max entries must be positive').optional(),
  startDate: z.string().datetime('Invalid start date'),
  endDate: z.string().datetime('Invalid end date'),
  image: z.string().url('Invalid image URL').optional(),
  rules: z.array(z.string()).optional(),
  prizeItems: z.array(z.string()).optional(),
  sponsor: z.string().max(255, 'Sponsor name is too long').optional()
})

export const dynamic = 'force-dynamic';

// GET - List giveaways
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build query conditions
    const conditions = []
    
    if (status) {
      conditions.push(eq(giveaways.status, status))
    }
    
    if (search) {
      conditions.push(
        or(
          like(giveaways.title, `%${search}%`),
          like(giveaways.description, `%${search}%`)
        )
      )
    }

    // Build sort order
    const sortColumn = sortBy === 'title' ? giveaways.title :
                      sortBy === 'startDate' ? giveaways.startDate :
                      sortBy === 'endDate' ? giveaways.endDate :
                      sortBy === 'prizeValue' ? giveaways.prizeValue :
                      giveaways.createdAt
    
    const orderBy = sortOrder === 'asc' ? asc(sortColumn) : desc(sortColumn)

    // Get giveaways with pagination
    const offset = (page - 1) * limit
    const giveawaysQuery = db
      .select({
        id: giveaways.id,
        title: giveaways.title,
        description: giveaways.description,
        longDescription: giveaways.longDescription,
        prizeValue: giveaways.prizeValue,
        maxEntries: giveaways.maxEntries,
        startDate: giveaways.startDate,
        endDate: giveaways.endDate,
        status: giveaways.status,
        image: giveaways.image,
        rules: giveaways.rules,
        prizeItems: giveaways.prizeItems,
        sponsor: giveaways.sponsor,
        createdBy: giveaways.createdBy,
        createdAt: giveaways.createdAt,
        updatedAt: giveaways.updatedAt,
        creatorName: users.name
      })
      .from(giveaways)
      .leftJoin(users, eq(giveaways.createdBy, users.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset)

    const giveawaysList = await giveawaysQuery

    // Get total count for pagination
    const [totalCount] = await db
      .select({ count: db.$count(giveaways.id) })
      .from(giveaways)
      .where(conditions.length > 0 ? and(...conditions) : undefined)

    const totalPages = Math.ceil(totalCount.count / limit)

    return successResponse({
      giveaways: giveawaysList,
      pagination: {
        page,
        limit,
        total: totalCount.count,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }, 'Giveaways retrieved successfully')

  } catch (error) {
    return handleApiError(error)
  }
}

// POST - Create giveaway
export async function POST(request: NextRequest) {
  try {
    const user = await requireAdmin(request)
    const body = await request.json()

    // Validate input
    const validation = createGiveawaySchema.safeParse(body)
    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors
      return validationErrorResponse(errors)
    }

    const giveawayData = validation.data

    // Additional validation
    const startDate = new Date(giveawayData.startDate)
    const endDate = new Date(giveawayData.endDate)

    if (startDate >= endDate) {
      return validationErrorResponse({ endDate: ['End date must be after start date'] })
    }

    // Determine initial status based on dates
    const now = new Date()
    let initialStatus: 'upcoming' | 'active' | 'ended' = 'upcoming'
    
    if (startDate <= now && endDate > now) {
      initialStatus = 'active'
    } else if (endDate <= now) {
      initialStatus = 'ended'
    }

    // Create giveaway
    const [newGiveaway] = await db
      .insert(giveaways)
      .values({
        ...giveawayData,
        startDate,
        endDate,
        status: initialStatus,
        createdBy: user.id
      })
      .returning()

    return successResponse(newGiveaway, 'Giveaway created successfully')

  } catch (error) {
    return handleApiError(error)
  }
} 