Brief-dino-park
Présentation

Brief-dino-park est une application de réservation pour un parc à dinosaures. Elle permet aux utilisateurs de réserver des visites et aux administrateurs de gérer les réservations via un panneau dédié.

⚠️ Note : l’interface utilisateur n’est pas parfaitement fluide. Parfois, il faut recharger la page pour que le formulaire s’affiche correctement. Pour les formulaires soumis en mode administrateur, pensez à vérifier la console du navigateur pour confirmer que la requête a bien été envoyée.

Accès administrateur

Le panneau administrateur est accessible via la route suivante :

/admin/gateway/1234

Lancement de l'application

Si Docker est installé sur votre machine, vous pouvez lancer l’application facilement avec :

docker-compose up -d

Cela permettra de démarrer tous les services nécessaires en arrière-plan.

Fonctionnalités principales

Réservation de visites pour le parc à dinosaures.

Gestion des réservations via le panneau administrateur.

Visualisation et suivi des réservations en temps réel (via la console pour les formulaires administrateurs)
