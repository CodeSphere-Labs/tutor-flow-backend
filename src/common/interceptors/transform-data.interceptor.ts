import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformDataInterceptor<T, R> implements NestInterceptor<T, R> {
  constructor(private readonly dto: new () => R) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<R> {
    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          return data.map((item) => plainToInstance(this.dto, item)) as R;
        }
        return plainToInstance(this.dto, data);
      }),
    );
  }
}
