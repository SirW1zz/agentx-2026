# Step 1: Build the React application
FROM node:22-alpine as build-step
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

# REPLACE THIS URL with your actual n8n Webhook URL
ENV REACT_APP_N8N_WEBHOOK_URL=https://agentx2026.app.n8n.cloud/webhook/time-assistant

RUN npm run build

# Step 2: Serve the app using Nginx
FROM nginx:alpine
# If using Vite, change '/app/build' to '/app/dist'
COPY --from=build-step /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]