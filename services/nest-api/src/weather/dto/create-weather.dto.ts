import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateWeatherDto {
  @IsString()
  @IsNotEmpty()
  source: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  timezone?: string;

  @IsOptional()
  current?: Record<string, any>;

  @IsOptional()
  raw?: Record<string, any>;

  @IsOptional()
  fetchedAtISO?: string;

  @IsOptional()
  meta?: Record<string, any>;
}
