import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = this.getStatus(exception);
    const message = this.getMessage(exception);

    this.logError(status, message);

    response.status(status).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      path: request.url,
      message: this.isMessageObject(message) ? message.message : message,
    });
  }

  /**
   * Récupère le status de l'exception.
   * @param exception l'exception à traiter.
   * @private
   * @returns un nombre.
   */
  private getStatus(exception: unknown): number {
    return exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
  }

  /**
   * Récupère le message de l'exception.
   * @param exception l'exception à traiter.
   * @private
   * @returns un objet.
   */
  private getMessage(exception: unknown): unknown {
    return exception instanceof HttpException ? exception.getResponse() : exception;
  }

  /**
   * Log l'erreur avec le status et le message.
   * @param status le status de l'erreur (ex : 404, 500, etc).
   * @param message le message de l'erreur.
   * @private
   * @returns void.
   */
  private logError(status: number, message: unknown): void {
    this.logger.error(`Status: ${status} Error: ${JSON.stringify(message)}`);
  }

  /**
   * Vérifie si l'objet passé en paramètre est un objet de message.
   * Si c'est le cas, alors on affiche la clé message.
   * @param obj l'objet à vérifier.
   * @private
   * @returns un booléen.
   */
  private isMessageObject(obj: unknown): obj is { message: string } {
    return obj && typeof obj === 'object' && 'message' in obj;
  }
}
