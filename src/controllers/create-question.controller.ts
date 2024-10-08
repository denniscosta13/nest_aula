import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { CurrentUser } from 'src/auth/current-user-decorator'
import { UserPayload } from 'src/auth/jwt.strategy'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from 'zod'

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema)

@Controller('/questions')
@UseGuards(AuthGuard('jwt'))
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateQuestionBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { title, content } = body
    const { sub: userId } = user
    const slug = this.stringToSlug(title)

    console.log(userId)

    await this.prisma.question.create({
      data: {
        authorId: userId,
        title,
        content,
        slug,
      },
    })
  }

  private stringToSlug(title: string): string {
    return title
      .normalize('NFD') // Normaliza a string para decompor os caracteres acentuados
      .replace(/[\u0300-\u036f]/g, '') // Remove os diacríticos (acentos)
      .toLowerCase() // Converte a string para minúsculas
      .trim() // Remove espaços em branco nas extremidades
      .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
      .replace(/\s+/g, '-') // Substitui espaços por hífens
      .replace(/-+/g, '-') // Remove hífens duplicados
  }
}
