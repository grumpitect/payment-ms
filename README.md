# Payment Microservice
I have tried to structure, my modules based on functionality not *database entities*. In this structure all *entities* are defined together and any module that required one or more *entities* would register them themselves and uses a `data service` to manipulate the data. I deliberately did not expose *repositories* to the `logic service` so that the interface between data and logic would be clearly defined.

## Seeding the Database
The `SeederModule` is used to seed the database with initial data for testing purposes. The seeded categories and products are shown below. You can use `yarn run seed` command or set the `AUTO_SEED` environment variable to `true` to seed the database. (This is enabled by default)

You can add more seed commands to the `SeederService`'s `seed` method located at `src/database/seeders/seeder.service.ts`.

```
                             a
                        +---------+
                        |         |
                        |         |
         5% discount    d         g
                        |         | ----------------\
                        |         |                  -----------------
         20% discount   b         v                  default (product code: 0002)
                   +---------+    ---\             also has product 0001 as a child
                   |         |        -----\
                   |         |              -----\
                   c         e                    -----\
                           /-                           ---
                         /-                  default (product code: 0003)
                      /--                    the product has 17% discount
                    /-
                  /-
                --
   default (product code: 0001)
 also has product 0002 as a child
```

## Environments
The `EnvModule` is responsible for providing the whole application with the configurations via `.env` files or `Environment Variables`. This is a `@Global` module so there is no need to `import` it into any module that you want to use it. You can just inject `EnvService` and you are good to go. Every configuration via `.env` files or `Environment Variables` are supposed to go through `EnvService` and be accessible to other parts of the application as typed properties of this service.

You can also create `.env.local` file in the `envs` directory to override any default settings which are set in the `.env.development` file. `.env.local` is already ignored in the `.gitignore` file.

## Authentication and Authorization
I assume that the user is authenticated by some method (not implemented). I use a mock user profile for development purposes. You can use the `SHOULD_MOCK_USER` environment variable to control this behavior. The `MOCK_USER_ID` and `MOCK_USER_IS_ADMIN` will be used to construct a mock user if `SHOULD_MOCK_USER` is set to `true` (default). The `PoliciesGuard` would use this mock user or will get the user from the request context based on these settings.

The `PoliciesGuard` is set as the global `APP_GUARD` and will prevent access to any controller missing the `CheckPolicies` decorator. This will greatly reduce accidental access to critical resources.

I have used `@casl/ability` module and created a factory, a guard, and a decorator so that we can control resource access. This way not only we can enforce roles but also policies. For example, we can define even a manager user can edit/delete a resource if some conditions are met. Current rules are defined in the `CaslAbilityFactory` located at `src/auth/casl-ability.factory.ts`.

## Swagger
You can access the swagger endpoint at `/swagger`.

## Docker
The project is dockerized. So you run the project without docker by using `yarn run start` command or with `docker-compose up` command. Using docker-compose also brings up a separate MongoDB docker container so the application is completely isolated.

## EndPoint Explained (/discount/product)
The endpoint would require you to at least provide the `productCode`. If you are using the `AUTO_SEED` option (default) then you can use `0001`, `0002`, or `0003` product codes.
I have designed the data so that every product has a `defaultCategory` and a `categories` array. So each product can essentially have multiple categories.

If you only pass in the `productCode` then the `defaultCategory` of the product will be used if the product does not have a direct `discount` set.

Using the `useAllCategories` option: This will query the database for all the parent categories of the product using the `categories` property.
Using the `specificCategories` option: This is an array, so you can select a subset of the categories that you want so that the discount would be calculated for these specific ones.

The service will prioritize the discount from the product itself even when `useAllCategories` is set to true.

*Input validation is done using the `class-validator` npm module.*

## Querying the EndPoint (/discount/product)
Of course, you can use Swagger to test the endpoint. I will put this cURL command here just for convenience:

```sh
curl --location --request GET 'http://localhost:3000/discount/product?productCode=0002&specificCategories=e&specificCategories=v'
```

## Test
You can run tests by running `yarn run test` command.

## Notes
I was hesitant to add multiple categories per product. If it was up to me I would not store the discount in product or category collections. Instead, I would define a new model for storing discount data and its conditions like duration, category, brand, provider, and so on.

