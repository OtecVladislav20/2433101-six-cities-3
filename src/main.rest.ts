import 'reflect-metadata';
import { Container } from 'inversify';
import { RestApplication } from './rest';
import { Component } from './shared/types/component.enum';
import { createRestApplicationContainer } from './rest/rest.container.js';
import { createUserContainer } from './shared/modules/user/user.container';
import { createOfferContainer } from './shared/modules/offer/offer.container';
import { createCommentContainer } from './shared/modules/comment/comment.container';
import { createAuthContainer } from './shared/modules/auth/auth.container';


async function bootstrap() {
  const appContainer = Container.merge(
    createRestApplicationContainer(),
    createUserContainer(),
    createOfferContainer(),
    createCommentContainer(),
    createAuthContainer(),
  );

  const application = appContainer.get<RestApplication>(Component.RestApplication);
  await application.init();
}

bootstrap();
