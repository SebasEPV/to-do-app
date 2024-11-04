import { Injectable, ConflictException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  // Retorna un usuario que coincida con el correo electrónico ingresado
  async getUser(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async createUser(data: {
    name: string;
    email: string;
    password: string;
    startTime?: Date;
    endTime?: Date;
  }): Promise<string> {
    // Verifica si el usuario ya existe
    const existingUser = await this.getUser(data.email);
    if (existingUser) {
      throw new ConflictException(
        `Ya existe un usuario con el correo ${data.email}.`,
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword, // Guarda la contraseña hasheada
        startTime: data.startTime ? data.startTime.toISOString() : undefined, // Convierte a string
        endTime: data.endTime ? data.endTime.toISOString() : undefined, // Convierte a string
      },
    });
    return `Se ha creado un usuario con el correo de ${data.email}.`;
  }
}
