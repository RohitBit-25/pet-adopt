import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";

const resources = {
  en: {
    translation: {
      welcome: "Welcome",
      events: "Events",
      myEvents: "My Events",
      createEvent: "Create Event",
      userManagement: "User Management",
      rsvp: "RSVP",
      cancelRsvp: "Cancel RSVP",
      going: "Going",
      ban: "Ban",
      unban: "Unban",
      promote: "Promote to Admin",
      demote: "Demote to User",
      // Add more keys as needed
    },
  },
  es: {
    translation: {
      welcome: "Bienvenido",
      events: "Eventos",
      myEvents: "Mis Eventos",
      createEvent: "Crear Evento",
      userManagement: "Gestión de Usuarios",
      rsvp: "Confirmar asistencia",
      cancelRsvp: "Cancelar asistencia",
      going: "Asistiendo",
      ban: "Bloquear",
      unban: "Desbloquear",
      promote: "Promover a Admin",
      demote: "Degradar a Usuario",
      // Add more keys as needed
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: Localization.locale.split("-")[0],
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
