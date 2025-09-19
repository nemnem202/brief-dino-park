# Étape 1 : construire le projet
FROM node:22 AS builder

WORKDIR /app

# Copier package.json + package-lock.json pour installer les dépendances
COPY package*.json ./

RUN npm install

# Copier tout le projet
COPY . .

# Compiler le backend et le frontend + copier les vues/assets
# Assure-toi que npm run build génère bien tout dans la racine du dossier public
RUN npm run build

# Étape 2 : conteneur final
FROM node:22

WORKDIR /app

# Copier uniquement ce dont on a besoin depuis l'étape builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
# AJOUT : Copier le dossier public entier
COPY --from=builder /app/public ./public 

RUN npm install --production

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "dist/core/app.js"]