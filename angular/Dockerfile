FROM node:18 AS build
WORKDIR /app
COPY . .
RUN npm install --force
RUN npm run build --prod

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html