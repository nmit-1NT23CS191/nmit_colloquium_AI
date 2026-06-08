import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "upload_title": "Upload Colloquium PDF / DOCX",
      "upload_subtitle": "AI extracts event details automatically from your document",
      "file_selected": "File selected",
      "drag_drop_files": "Drag & drop your PDF or DOCX here",
      "click_to_browse": "or click to browse files · up to 10 MB",
      "event_extracted_success": "Event extracted successfully!",
      "review_details": "Review the details below and they've been saved automatically",
      "extracted_event_preview": "Extracted Event Preview",
      "event_already_exists": "Event Already Exists",
      "nmit_colloquium": "NMIT Colloquium",
      "admin_portal": "Admin Portal",
      "dashboard": "Dashboard",
      "upload_document": "Upload Document",
      "events": "Events",
      "analytics": "Analytics",
      "file_manager": "File Manager",
      "activity_logs": "Activity Logs",
      "logout": "Logout"
    }
  },
  es: {
    translation: {
      "upload_title": "Cargar PDF / DOCX de coloquio",
      "upload_subtitle": "La IA extrae los detalles del evento automáticamente de su documento",
      "file_selected": "Archivo seleccionado",
      "drag_drop_files": "Arrastre y suelte su PDF o DOCX aquí",
      "click_to_browse": "o haga clic para buscar archivos · hasta 10 MB",
      "event_extracted_success": "¡Evento extraído con éxito!",
      "review_details": "Revise los detalles a continuación y se guardarán automáticamente",
      "extracted_event_preview": "Vista previa del evento extraído",
      "event_already_exists": "El evento ya existe",
      "nmit_colloquium": "Coloquio NMIT",
      "admin_portal": "Portal del Administrador",
      "dashboard": "Tablero",
      "upload_document": "Cargar Documento",
      "events": "Eventos",
      "analytics": "Analítica",
      "file_manager": "Gestor de Archivos",
      "activity_logs": "Registros de Actividad",
      "logout": "Cerrar Sesión"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
