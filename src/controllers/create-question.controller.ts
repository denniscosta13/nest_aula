import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from 'zod'

// const authenticateBodySchema = z.object({
//   email: z.string().email(),
//   password: z.string(),
// })

// type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/questions')
@UseGuards(AuthGuard('jwt'))
export class CreateQuestionController {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  @Post()
  async handle() {
    return 'ok'
  }
}
