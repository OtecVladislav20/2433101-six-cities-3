import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { BaseController } from '../../libs/rest/controller/base-controller.abstract.js';
import { OfferService } from './offer-service.interface.js';
import { HttpMethod } from '../../libs/rest/types/http-method.enum.js';
import { fillDTO } from '../../helpers/common.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { HttpError } from '../../libs/rest/errors/http-error.js';
import { StatusCodes } from 'http-status-codes';
import { ParamOfferId } from './type/param-offerid.type.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';


@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController…');

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.find();
    const responseData = fillDTO(OfferRdo, offers);
    this.ok(res, responseData);
  }

  public async create(
    { body }: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDto>,
    res: Response
  ): Promise<void> {
    const result = await this.offerService.create(body);
    this.created(res, fillDTO(OfferRdo, result));
  }

  public async findById({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.findById(offerId);
    const responseData = fillDTO(OfferRdo, offer);
    this.ok(res, responseData);
  }

  public async updateById({ body, params }: Request<ParamOfferId, unknown, UpdateOfferDto>, res: Response): Promise<void> {
    const updatedOffer = await this.offerService.updateById(params.offerId, body);
    this.ok(res, fillDTO(OfferRdo, updatedOffer));
  }

  public async deleteById(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    await this.offerService.deleteById(id);
    this.noContent(res);
  }

  public async findByCityAndPremium(req: Request, res: Response): Promise<void> {
    const city = req.query.city;
    if (city) {
      const offers = await this.offerService.findByCityAndPremium(city as string, true);
      const responseData = fillDTO(OfferRdo, offers);
      this.ok(res, responseData);
    } else {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Bad request',
        'OfferController'
      );
    }
  }

  public async findByFavorite(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.findByFavorite(true);
    const responseData = fillDTO(OfferRdo, offers);
    this.ok(res, responseData);
  }

  public async addToFavorite({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    const result = await this.offerService.addToFavorite(offerId);
    const responseData = fillDTO(OfferRdo, result);
    this.ok(res, responseData);
  }

  public async removeFavoriteOffer({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    const result = await this.offerService.removeFromFavorite(offerId);
    const responseData = fillDTO(OfferRdo, result);
    this.ok(res, responseData);
  }

  // public async findByOfferId({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
  //   const comments = await this.commentService.findByOfferId(params.offerId);
  //   this.ok(res, fillDTO(CommentRdo, comments));
  // }
}
