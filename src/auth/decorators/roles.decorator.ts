import { SetMetadata } from '@nestjs/common';
import type { Role } from '../types/roles';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
