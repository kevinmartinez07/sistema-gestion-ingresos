import { IMovementRepository } from '../../../repositories/IMovementRepository';
import { Result } from '../../../shared/Result';
import { GetBalanceRequest } from '../dtos/GetBalanceRequest';
import { GetBalanceResponse } from '../dtos/GetBalanceResponse';

/** Get balance query */
export class GetBalanceUseCase {
  constructor(private movementRepository: IMovementRepository) {}

  async execute(
    query?: GetBalanceRequest
  ): Promise<Result<GetBalanceResponse>> {
    const [totalIncome, totalExpense] = await Promise.all([
      this.movementRepository.getTotalIncome(query?.userId),
      this.movementRepository.getTotalExpense(query?.userId),
    ]);

    return Result.ok({
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    });
  }
}
