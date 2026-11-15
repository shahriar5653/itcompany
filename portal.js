/**
 * RSTechwerk Client Workspace Portal
 * Organized multi-view SaaS client portal backed by Express + MySQL API
 */

const PORTAL_SESSION_KEY = 'rstechwerk_admin_session';
const PORTAL_THEME_KEY = 'rstechwerk_portal_theme';
const session = JSON.parse(
  localStorage.getItem(PORTAL_SESSION_KEY) || sessionStorage.getItem(PORTAL_SESSION_KEY) || 'null'
);

const PORTAL_LANGUAGE_COPY = {
  de: { 'Client Portal':'Kundenportal', Overview:'Übersicht', 'Projects & Milestones':'Projekte & Meilensteine', 'Quotes & Offers':'Angebote', 'Maintenance & Retainers':'Wartung & Retainer', 'Billing & Invoices':'Abrechnung & Rechnungen', 'Delivery Updates':'Lieferupdates', Documents:'Dokumente', 'Profile & Security':'Profil & Sicherheit', Workspace:'Arbeitsbereich', 'Contact Team':'Team kontaktieren', 'My Profile':'Mein Profil', 'CLIENT WORKSPACE':'KUNDENARBEITSBEREICH', 'Open quotes':'Offene Angebote', 'Running projects':'Laufende Projekte', 'Average progress':'Durchschnittlicher Fortschritt', 'Need something from the team?':'Sie brauchen Unterstützung?', 'Company & contact details':'Unternehmens- und Kontaktdaten', 'Save profile':'Profil speichern', Security:'Sicherheit', 'Change password':'Passwort ändern', 'Preferred language':'Bevorzugte Sprache', English:'Englisch', Deutsch:'Deutsch', 'Ongoing care for your software':'Laufende Betreuung Ihrer Software', 'Maintenance invoices':'Wartungsrechnungen', 'Accept offer':'Angebot annehmen', Reject:'Ablehnen', 'No projects yet':'Noch keine Projekte', 'No maintenance services are currently assigned to this account.':'Diesem Konto sind derzeit keine Wartungsleistungen zugewiesen.' },
  es: { 'Client Portal':'Portal del cliente', Overview:'Resumen', 'Projects & Milestones':'Proyectos y hitos', 'Quotes & Offers':'Cotizaciones y ofertas', 'Maintenance & Retainers':'Mantenimiento y retainers', 'Billing & Invoices':'Facturación y facturas', 'Delivery Updates':'Actualizaciones de entrega', Documents:'Documentos', 'Profile & Security':'Perfil y seguridad', Workspace:'Espacio de trabajo', 'Contact Team':'Contactar al equipo', 'My Profile':'Mi perfil', 'CLIENT WORKSPACE':'ESPACIO DEL CLIENTE', 'Open quotes':'Cotizaciones abiertas', 'Running projects':'Proyectos activos', 'Average progress':'Progreso medio', 'Need something from the team?':'¿Necesita ayuda del equipo?', 'Company & contact details':'Datos de empresa y contacto', 'Save profile':'Guardar perfil', Security:'Seguridad', 'Change password':'Cambiar contraseña', 'Preferred language':'Idioma preferido', English:'Inglés', Deutsch:'Alemán', 'Ongoing care for your software':'Soporte continuo para su software', 'Maintenance invoices':'Facturas de mantenimiento', 'Accept offer':'Aceptar oferta', Reject:'Rechazar', 'No projects yet':'Aún no hay proyectos', 'No maintenance services are currently assigned to this account.':'No hay servicios de mantenimiento asignados a esta cuenta.' }
};
Object.assign(PORTAL_LANGUAGE_COPY.de, {
  'Select language':'Sprache auswählen', 'Open navigation menu':'Navigationsmenü öffnen', 'Close navigation menu':'Navigationsmenü schließen', 'Client workspace navigation':'Navigation im Kundenbereich', 'Select project':'Projekt auswählen', 'Filter offers':'Angebote filtern', 'Filter billing ledger':'Abrechnung filtern', 'Search files or projects…':'Dateien oder Projekte suchen…',
  'Engineering sprint updates and release notes will appear here as work progresses.':'Sprint-Updates und Release-Hinweise erscheinen hier im Projektverlauf.', 'Detailed delivery progress, milestone approvals, and project files.':'Detaillierter Projektfortschritt, Meilensteinfreigaben und Projektdateien.', 'Custom engineering proposals and project scopes prepared for your organization will appear here.':'Individuelle Angebote und Projektumfänge für Ihr Unternehmen erscheinen hier.', 'Active retainer agreements and post-launch SLA coverage will appear here.':'Aktive Retainer-Verträge und vereinbarte Supportleistungen erscheinen hier.', 'Recurring and on-demand retainer invoices will appear here once billed.':'Wiederkehrende und bedarfsbezogene Rechnungen erscheinen hier nach der Abrechnung.', 'Monitor active SLA plans, recurring engineering retainers, and maintenance billing.':'Verfolgen Sie aktive Servicevereinbarungen, Retainer und Wartungsabrechnungen.', 'Project milestone charges, invoices, and maintenance bills will appear here.':'Meilensteinzahlungen, Projekt- und Wartungsrechnungen erscheinen hier.', 'Consolidated ledger of project milestones, invoices, and maintenance payments.':'Übersicht über Meilensteine, Rechnungen und Wartungszahlungen.', 'Weekly sprint summaries and engineering release notes will appear here.':'Wöchentliche Sprintberichte und Release-Hinweise erscheinen hier.', 'Chronological sprint progress and engineering notes across your projects.':'Chronologischer Fortschritt und technische Hinweise zu Ihren Projekten.', 'Secure access to specifications, technical deliverables, and project documentation.':'Sicherer Zugriff auf Spezifikationen, technische Ergebnisse und Projektdokumentation.', 'Manage your organization details, contact preferences, and account password.':'Verwalten Sie Unternehmensdaten, Kontakteinstellungen und Ihr Passwort.', 'No Matching Documents':'Keine passenden Dokumente',
  'Active':'Aktiv', 'In Progress':'In Bearbeitung', 'On Hold':'Pausiert', 'Client Review':'Kundenprüfung', 'Testing':'In Prüfung', 'Completed':'Abgeschlossen', 'Cancelled':'Storniert', 'Draft':'Entwurf', 'Sent':'Gesendet', 'Rejected':'Abgelehnt', 'Expired':'Abgelaufen', 'Pending':'Ausstehend', 'Paid':'Bezahlt', 'Overdue':'Überfällig', 'Approved':'Freigegeben', 'Submitted':'Eingereicht', 'Revision Requested':'Änderung angefordert', 'Payment Pending':'Zahlung ausstehend', 'Failed':'Fehlgeschlagen',
  'Track active builds, review submitted deliverables, and manage milestone payments.':'Verfolgen Sie aktive Projekte, prüfen Sie Ergebnisse und verwalten Sie Meilensteinzahlungen.', 'Once your proposal is accepted and engineering kickoff begins, your full project workspace will appear here.':'Nach Annahme Ihres Angebots und Projektstart erscheint hier Ihre vollständige Projektübersicht.', 'Deliverable milestones will appear here once scheduled by your project lead.':'Die vereinbarten Meilensteine erscheinen hier, sobald sie geplant wurden.', 'Invoices linked to this project will appear here when issued.':'Rechnungen für dieses Projekt erscheinen hier nach ihrer Ausstellung.', 'Sprint progress reports and deployment notices for this project will appear here.':'Sprintberichte und Bereitstellungshinweise für dieses Projekt erscheinen hier.', 'Architecture diagrams, specifications, and release bundles shared by your team will appear here.':'Freigegebene Architekturdiagramme, Spezifikationen und Release-Dateien erscheinen hier.', 'Review project proposals, commercial scope, and authorize engagement kickoff.':'Prüfen Sie Projektangebote und Leistungsumfang und geben Sie den Projektstart frei.', 'No Billing Records Found':'Keine Abrechnungen gefunden', 'No Shared Documents Yet':'Noch keine freigegebenen Dokumente',
  'Accept Offer':'Angebot annehmen', 'Decline':'Ablehnen', 'Approve':'Freigeben', 'Request Revision':'Änderung anfordern', 'Pay with Stripe':'Mit Stripe bezahlen', 'Dismiss':'Schließen', 'No Active Projects Yet':'Noch keine aktiven Projekte', 'No Delivery Updates Yet':'Noch keine Projektupdates', 'Review Open Offers':'Offene Angebote ansehen', 'View Projects':'Projekte ansehen', 'View Offers':'Angebote ansehen', 'Active Projects':'Aktive Projekte', 'Open Offers':'Offene Angebote', 'Average Progress':'Durchschnittlicher Fortschritt', 'Balance Due':'Offener Betrag', 'Across running projects':'Über alle laufenden Projekte', 'Project Workspaces':'Projektübersicht', 'Current delivery progress and milestone status':'Aktueller Fortschritt und Status der Meilensteine', 'Recent Delivery Updates':'Neueste Projektupdates', 'Latest notes from your engineering team':'Aktuelle Nachrichten Ihres Entwicklungsteams', 'All Projects →':'Alle Projekte →', 'Full Timeline →':'Gesamten Verlauf →', 'No Projects Assigned Yet':'Noch keine Projekte zugewiesen', 'Check Quotes & Offers':'Angebote ansehen', 'Milestone':'Meilenstein', 'Due Date':'Fälligkeitsdatum', 'Actions':'Aktionen', 'No Milestones Configured':'Noch keine Meilensteine', 'Invoice #':'Rechnungsnummer', 'Description':'Beschreibung', 'No Project Invoices':'Keine Projektrechnungen', 'No Updates Posted':'Noch keine Updates', 'Download':'Herunterladen', 'No Shared Files':'Keine freigegebenen Dateien', 'No Offers in This View':'Keine Angebote in dieser Ansicht', 'Open':'Offen', 'Accepted':'Angenommen', 'Closed':'Abgeschlossen', 'Plan / Service':'Plan / Leistung', 'Linked Project':'Zugehöriges Projekt', 'Cadence':'Abrechnungsintervall', 'Next Billing':'Nächste Abrechnung', 'Rate':'Betrag', 'No Maintenance Contracts':'Keine Wartungsverträge', 'Contract':'Vertrag', 'Payment':'Zahlung', 'No Maintenance Invoices':'Keine Wartungsrechnungen', 'Active Care Plans':'Aktive Wartungspläne', 'Monthly Retainer Rate':'Monatlicher Retainer', 'Active monthly commitments':'Aktive monatliche Verpflichtungen', 'Open Maintenance Invoices':'Offene Wartungsrechnungen', 'Active Maintenance Contracts':'Aktive Wartungsverträge', 'Maintenance Invoices':'Wartungsrechnungen',
  'Company name':'Unternehmensname', 'Contact name':'Kontaktperson', 'Email':'E-Mail', 'Phone':'Telefon', 'Country':'Land', 'Company website':'Unternehmenswebsite', 'Timezone':'Zeitzone', 'Address':'Adresse', 'City / postal code':'Stadt / Postleitzahl', 'Current password':'Aktuelles Passwort', 'New password':'Neues Passwort', 'Profile':'Profil', 'Account':'Konto', 'Sign out':'Abmelden', 'Back to website':'Zur Website', 'Projects':'Projekte', 'Offers':'Angebote', 'Invoices':'Rechnungen', 'Updates':'Aktualisierungen', 'Status':'Status', 'Amount':'Betrag', 'Due date':'Fälligkeitsdatum', 'No invoices yet.':'Noch keine Rechnungen.', 'No updates yet.':'Noch keine Aktualisierungen.', 'No documents yet.':'Noch keine Dokumente.', 'Loading…':'Wird geladen…'
});
Object.assign(PORTAL_LANGUAGE_COPY.es, {
  'Select language':'Seleccionar idioma', 'Open navigation menu':'Abrir menú de navegación', 'Close navigation menu':'Cerrar menú de navegación', 'Client workspace navigation':'Navegación del espacio del cliente', 'Select project':'Seleccionar proyecto', 'Filter offers':'Filtrar ofertas', 'Filter billing ledger':'Filtrar facturación', 'Search files or projects…':'Buscar archivos o proyectos…',
  'Engineering sprint updates and release notes will appear here as work progresses.':'Las novedades de los sprints y las versiones aparecerán aquí conforme avance el trabajo.', 'Detailed delivery progress, milestone approvals, and project files.':'Progreso detallado, aprobación de hitos y archivos del proyecto.', 'Custom engineering proposals and project scopes prepared for your organization will appear here.':'Las propuestas y los alcances preparados para su organización aparecerán aquí.', 'Active retainer agreements and post-launch SLA coverage will appear here.':'Los acuerdos activos y la cobertura de soporte aparecerán aquí.', 'Recurring and on-demand retainer invoices will appear here once billed.':'Las facturas recurrentes y bajo demanda aparecerán aquí cuando se emitan.', 'Monitor active SLA plans, recurring engineering retainers, and maintenance billing.':'Consulte los acuerdos de servicio, los planes recurrentes y la facturación de mantenimiento.', 'Project milestone charges, invoices, and maintenance bills will appear here.':'Los cargos por hitos y las facturas de proyectos y mantenimiento aparecerán aquí.', 'Consolidated ledger of project milestones, invoices, and maintenance payments.':'Resumen de hitos, facturas y pagos de mantenimiento.', 'Weekly sprint summaries and engineering release notes will appear here.':'Los resúmenes semanales y las notas de lanzamiento aparecerán aquí.', 'Chronological sprint progress and engineering notes across your projects.':'Progreso cronológico y notas técnicas de sus proyectos.', 'Secure access to specifications, technical deliverables, and project documentation.':'Acceso seguro a especificaciones, entregables técnicos y documentación.', 'Manage your organization details, contact preferences, and account password.':'Gestione los datos de su organización, sus preferencias de contacto y su contraseña.', 'No Matching Documents':'No hay documentos coincidentes',
  'Active':'Activo', 'In Progress':'En curso', 'On Hold':'En pausa', 'Client Review':'Revisión del cliente', 'Testing':'En pruebas', 'Completed':'Completado', 'Cancelled':'Cancelado', 'Draft':'Borrador', 'Sent':'Enviado', 'Rejected':'Rechazado', 'Expired':'Vencido', 'Pending':'Pendiente', 'Paid':'Pagado', 'Overdue':'Vencido', 'Approved':'Aprobado', 'Submitted':'Enviado', 'Revision Requested':'Cambios solicitados', 'Payment Pending':'Pago pendiente', 'Failed':'Fallido',
  'Track active builds, review submitted deliverables, and manage milestone payments.':'Siga los proyectos activos, revise las entregas y gestione los pagos por hitos.', 'Once your proposal is accepted and engineering kickoff begins, your full project workspace will appear here.':'El espacio completo del proyecto aparecerá aquí después de aceptar la propuesta y comenzar el desarrollo.', 'Deliverable milestones will appear here once scheduled by your project lead.':'Los hitos aparecerán aquí cuando su responsable de proyecto los programe.', 'Invoices linked to this project will appear here when issued.':'Las facturas de este proyecto aparecerán aquí cuando se emitan.', 'Sprint progress reports and deployment notices for this project will appear here.':'Los informes de progreso y avisos de despliegue del proyecto aparecerán aquí.', 'Architecture diagrams, specifications, and release bundles shared by your team will appear here.':'Los diagramas de arquitectura, especificaciones y archivos compartidos aparecerán aquí.', 'Review project proposals, commercial scope, and authorize engagement kickoff.':'Revise las propuestas y el alcance comercial y autorice el inicio del proyecto.', 'No Billing Records Found':'No se encontraron registros de facturación', 'No Shared Documents Yet':'Aún no hay documentos compartidos',
  'Accept Offer':'Aceptar oferta', 'Decline':'Rechazar', 'Approve':'Aprobar', 'Request Revision':'Solicitar cambios', 'Pay with Stripe':'Pagar con Stripe', 'Dismiss':'Cerrar', 'No Active Projects Yet':'Aún no hay proyectos activos', 'No Delivery Updates Yet':'Aún no hay novedades de entrega', 'Review Open Offers':'Revisar ofertas abiertas', 'View Projects':'Ver proyectos', 'View Offers':'Ver ofertas', 'Active Projects':'Proyectos activos', 'Open Offers':'Ofertas abiertas', 'Average Progress':'Progreso medio', 'Balance Due':'Saldo pendiente', 'Across running projects':'De los proyectos activos', 'Project Workspaces':'Espacios de proyectos', 'Current delivery progress and milestone status':'Progreso actual y estado de los hitos', 'Recent Delivery Updates':'Últimas novedades de entrega', 'Latest notes from your engineering team':'Últimas notas de su equipo de desarrollo', 'All Projects →':'Todos los proyectos →', 'Full Timeline →':'Ver historial completo →', 'No Projects Assigned Yet':'Aún no hay proyectos asignados', 'Check Quotes & Offers':'Ver presupuestos y ofertas', 'Milestone':'Hito', 'Due Date':'Fecha de vencimiento', 'Actions':'Acciones', 'No Milestones Configured':'No hay hitos configurados', 'Invoice #':'Número de factura', 'Description':'Descripción', 'No Project Invoices':'No hay facturas del proyecto', 'No Updates Posted':'No hay actualizaciones', 'Download':'Descargar', 'No Shared Files':'No hay archivos compartidos', 'No Offers in This View':'No hay ofertas en esta vista', 'Open':'Abiertas', 'Accepted':'Aceptadas', 'Closed':'Cerradas', 'Plan / Service':'Plan / servicio', 'Linked Project':'Proyecto asociado', 'Cadence':'Frecuencia', 'Next Billing':'Próxima facturación', 'Rate':'Importe', 'No Maintenance Contracts':'No hay contratos de mantenimiento', 'Contract':'Contrato', 'Payment':'Pago', 'No Maintenance Invoices':'No hay facturas de mantenimiento', 'Active Care Plans':'Planes de soporte activos', 'Monthly Retainer Rate':'Cuota mensual', 'Active monthly commitments':'Compromisos mensuales activos', 'Open Maintenance Invoices':'Facturas de mantenimiento pendientes', 'Active Maintenance Contracts':'Contratos de mantenimiento activos', 'Maintenance Invoices':'Facturas de mantenimiento',
  'Company name':'Nombre de la empresa', 'Contact name':'Persona de contacto', 'Email':'Correo electrónico', 'Phone':'Teléfono', 'Country':'País', 'Company website':'Sitio web de la empresa', 'Timezone':'Zona horaria', 'Address':'Dirección', 'City / postal code':'Ciudad / código postal', 'Current password':'Contraseña actual', 'New password':'Nueva contraseña', 'Profile':'Perfil', 'Account':'Cuenta', 'Sign out':'Cerrar sesión', 'Back to website':'Volver al sitio web', 'Projects':'Proyectos', 'Offers':'Ofertas', 'Invoices':'Facturas', 'Updates':'Actualizaciones', 'Status':'Estado', 'Amount':'Importe', 'Due date':'Fecha de vencimiento', 'No invoices yet.':'Aún no hay facturas.', 'No updates yet.':'Aún no hay actualizaciones.', 'No documents yet.':'Aún no hay documentos.', 'Loading…':'Cargando…'
});
Object.assign(PORTAL_LANGUAGE_COPY.de, {
  'Client Workspace | RSTechwerk':'Kundenbereich | RSTechwerk','Techwerk':'Techwerk','Maintenance':'Wartung','Delivery & Files':'Lieferung & Dateien','Client Account':'Kundenkonto','Back to Website':'Zur Website','Sign Out':'Abmelden',
  'Welcome back,':'Willkommen zurück,','Client Delivery Workspace':'Kunden-Projektbereich','Active Projects':'Aktive Projekte','total projects':'Projekte insgesamt','total project':'Projekt insgesamt','Open Offers':'Offene Angebote','proposal on file':'Angebot hinterlegt','proposals on file':'Angebote hinterlegt','Across running projects':'Über laufende Projekte','active care plan':'aktiver Betreuungsplan','active care plans':'aktive Betreuungspläne','Need something from the team?':'Sie brauchen Unterstützung vom Team?','Action Required':'Aktion erforderlich','Review Offer:':'Angebot prüfen:','Offered amount':'Angebotssumme','Awaiting your decision':'Wartet auf Ihre Entscheidung','Accept Offer':'Angebot annehmen','Decline':'Ablehnen','Approve Deliverable:':'Lieferung freigeben:','Submitted for your review':'Zur Prüfung eingereicht','Milestone Payment:':'Meilensteinzahlung:','Pay with Stripe':'Mit Stripe bezahlen','Maintenance Invoice':'Wartungsrechnung','Projects & Milestones':'Projekte & Meilensteine','Track active builds, review submitted deliverables, and manage milestone payments.':'Verfolgen Sie laufende Projekte, prüfen Sie Lieferungen und verwalten Sie Meilensteinzahlungen.','No Projects Assigned Yet':'Noch keine Projekte zugewiesen','Once your proposal is accepted and engineering kickoff begins, your full project workspace will appear here.':'Sobald Sie ein Angebot annehmen und die Entwicklung beginnt, erscheint hier Ihr vollständiger Projektbereich.','Check Quotes & Offers':'Angebote ansehen','Milestone':'Meilenstein','Due Date':'Fälligkeitsdatum','Actions':'Aktionen','No Milestones Configured':'Noch keine Meilensteine eingerichtet','Start':'Start','Target Due':'Geplantes Ende','complete':'abgeschlossen','Milestones':'Meilensteine','Invoices':'Rechnungen','Delivery Updates':'Projektupdates','Shared Documents':'Geteilte Dokumente','Projects & Milestones':'Projekte & Meilensteine','Invoices linked to this project will appear here when issued.':'Rechnungen zu diesem Projekt erscheinen hier nach der Ausstellung.','Sprint progress reports and deployment notices for this project will appear here.':'Sprintberichte und Deployment-Mitteilungen erscheinen hier im Projektverlauf.','No Updates Posted':'Noch keine Updates veröffentlicht','No Shared Files':'Noch keine Dateien geteilt','Architecture diagrams, specifications, and release bundles shared by your team will appear here.':'Hier erscheinen Architekturdiagramme, Spezifikationen und Release-Dateien Ihres Teams.','Quotes & Offers':'Angebote','Review project proposals, commercial scope, and authorize engagement kickoff.':'Prüfen Sie Projektangebote und Leistungsumfang und geben Sie den Projektstart frei.','Created':'Erstellt','Valid until':'Gültig bis','Open':'Offen','Accepted':'Angenommen','Closed':'Abgeschlossen','No Offers in This View':'Keine Angebote in dieser Ansicht','Maintenance & Retainers':'Wartung & Retainer','Monitor active SLA plans, recurring engineering retainers, and maintenance billing.':'Verwalten Sie aktive SLAs, Engineering-Retainer und Wartungsabrechnungen.','Plan / Service':'Plan / Leistung','Linked Project':'Zugehöriges Projekt','Cadence':'Intervall','Next Billing':'Nächste Abrechnung','Rate':'Preis','Account-wide':'Gesamtes Kundenkonto','No Maintenance Contracts':'Keine Wartungsverträge','Active retainer agreements and post-launch SLA coverage will appear here.':'Aktive Retainer und Supportvereinbarungen nach dem Launch erscheinen hier.','Ongoing software maintenance and SLA coverage':'Laufende Softwarewartung und SLA-Abdeckung','Invoice #':'Rechnungsnummer','Contract':'Vertrag','Payment':'Zahlung','Paid':'Bezahlt','No Maintenance Invoices':'Keine Wartungsrechnungen','Recurring and on-demand retainer invoices will appear here once billed.':'Wiederkehrende und bedarfsbezogene Retainer-Rechnungen erscheinen nach der Abrechnung.','Active Care Plans':'Aktive Wartungspläne','Monthly Retainer Rate':'Monatlicher Retainer-Preis','Active monthly commitments':'Aktive monatliche Vereinbarungen','Open Maintenance Invoices':'Offene Wartungsrechnungen','Active Maintenance Contracts':'Aktive Wartungsverträge','Maintenance Invoices':'Wartungsrechnungen','Billing & Invoices':'Abrechnung & Rechnungen','Consolidated ledger of project milestones, invoices, and maintenance payments.':'Übersicht über Projektmeilensteine, Rechnungen und Wartungszahlungen.','Reference':'Referenz','Item & Project':'Position & Projekt','Action':'Aktion','All':'Alle','Unpaid':'Offen','Paid':'Bezahlt','No Billing Records Found':'Keine Abrechnungsdaten gefunden','Project milestone charges, invoices, and maintenance bills will appear here.':'Projektmeilensteine, Rechnungen und Wartungsgebühren erscheinen hier.','Paid':'Bezahlt','Due':'Fällig','Delivery Updates':'Projektupdates','Chronological sprint progress and engineering notes across your projects.':'Chronologischer Fortschritt und technische Notizen zu Ihren Projekten.','All Projects':'Alle Projekte','No Delivery Updates Yet':'Noch keine Projektupdates','Weekly sprint summaries and engineering release notes will appear here.':'Wöchentliche Sprint-Zusammenfassungen und Release-Hinweise erscheinen hier.','Shared Documents':'Geteilte Dokumente','Secure access to specifications, technical deliverables, and project documentation.':'Sicherer Zugriff auf Spezifikationen, technische Ergebnisse und Projektdokumentation.','Document Name':'Dokumentname','Project':'Projekt','Type':'Typ','Size':'Größe','Shared On':'Geteilt am','Search files or projects…':'Dateien oder Projekte suchen…','No Shared Documents Yet':'Noch keine Dokumente geteilt','Try clearing your search filter to inspect all project files.':'Entfernen Sie den Suchfilter, um alle Projektdateien zu sehen.','Contracts, technical specifications, and delivery packages shared with you will appear here.':'Verträge, technische Spezifikationen und bereitgestellte Dateien erscheinen hier.','Profile & Security':'Profil & Sicherheit','Manage your organization details, contact preferences, and account password.':'Verwalten Sie Unternehmensdaten, Kontaktpräferenzen und Ihr Passwort.','Saving…':'Wird gespeichert …','Updating…':'Wird aktualisiert …','Profile saved successfully.':'Profil erfolgreich gespeichert.','Password updated. Use it on your next sign-in.':'Passwort aktualisiert. Verwenden Sie es bei der nächsten Anmeldung.','Start':'Start','Target Due':'Geplantes Ende','% complete':'% abgeschlossen','Download failed.':'Download fehlgeschlagen.','Unable to download file.':'Datei konnte nicht heruntergeladen werden.','Payment checkout URL was not returned.':'Es wurde keine Zahlungs-URL zurückgegeben.','Please sign in to access your client workspace.':'Bitte melden Sie sich an, um auf den Kundenbereich zuzugreifen.','Unable to load portal data.':'Die Portaldaten konnten nicht geladen werden.','PayPal maintenance payment confirmed and recorded.':'PayPal-Zahlung für die Wartung wurde bestätigt und verbucht.','PayPal capture is pending verification.':'Die PayPal-Zahlung wird noch überprüft.','Payment completed. Invoice status updates automatically once confirmed.':'Zahlung abgeschlossen. Der Rechnungsstatus wird nach Bestätigung automatisch aktualisiert.','Checkout was cancelled. No charge was made.':'Der Zahlungsvorgang wurde abgebrochen. Es wurde nichts berechnet.','Dismiss':'Schließen','Unknown':'Unbekannt','In Progress':'In Bearbeitung','On Hold':'Pausiert','Client Review':'Kundenprüfung','Testing':'Im Test','Completed':'Abgeschlossen','Cancelled':'Storniert','Draft':'Entwurf','Sent':'Gesendet','Rejected':'Abgelehnt','Expired':'Abgelaufen','Pending':'Ausstehend','Overdue':'Überfällig','Approved':'Freigegeben','Submitted':'Eingereicht','Revision Requested':'Änderung angefragt','Payment Pending':'Zahlung ausstehend','Failed':'Fehlgeschlagen','Active':'Aktiv','PayPal':'PayPal','Stripe':'Stripe','Profile saved successfully.':'Profil erfolgreich gespeichert.','Your project workspace will appear automatically once you accept an open offer.':'Ihr Projektbereich wird freigeschaltet, sobald Sie ein Angebot annehmen.','Projects assigned to your company account will appear here.':'Hier erscheinen Projekte, die Ihrem Unternehmenskonto zugewiesen sind.'
});
Object.assign(PORTAL_LANGUAGE_COPY.es, {
  'Client Workspace | RSTechwerk':'Área de cliente | RSTechwerk','Techwerk':'Techwerk','Maintenance':'Mantenimiento','Delivery & Files':'Entregas y archivos','Client Account':'Cuenta de cliente','Back to Website':'Volver al sitio web','Sign Out':'Cerrar sesión',
  'Welcome back,':'Le damos la bienvenida,','Client Delivery Workspace':'Espacio de proyectos del cliente','Active Projects':'Proyectos activos','total projects':'proyectos en total','total project':'proyecto en total','Open Offers':'Ofertas abiertas','proposal on file':'propuesta disponible','proposals on file':'propuestas disponibles','Across running projects':'En los proyectos activos','active care plan':'plan de soporte activo','active care plans':'planes de soporte activos','Need something from the team?':'¿Necesita ayuda del equipo?','Action Required':'Acción necesaria','Review Offer:':'Revisar oferta:','Offered amount':'Importe ofertado','Awaiting your decision':'Pendiente de su decisión','Accept Offer':'Aceptar oferta','Decline':'Rechazar','Approve Deliverable:':'Aprobar entrega:','Submitted for your review':'Enviado para su revisión','Milestone Payment:':'Pago del hito:','Pay with Stripe':'Pagar con Stripe','Maintenance Invoice':'Factura de mantenimiento','Projects & Milestones':'Proyectos e hitos','Track active builds, review submitted deliverables, and manage milestone payments.':'Siga los proyectos activos, revise las entregas y gestione los pagos por hitos.','No Projects Assigned Yet':'Aún no hay proyectos asignados','Once your proposal is accepted and engineering kickoff begins, your full project workspace will appear here.':'Cuando acepte una propuesta y comience el desarrollo, aquí aparecerá su espacio de proyecto.','Check Quotes & Offers':'Consultar ofertas','Milestone':'Hito','Due Date':'Fecha de vencimiento','Actions':'Acciones','No Milestones Configured':'Aún no hay hitos configurados','Start':'Inicio','Target Due':'Fecha prevista','complete':'completado','Milestones':'Hitos','Invoices':'Facturas','Delivery Updates':'Actualizaciones','Shared Documents':'Documentos compartidos','Invoices linked to this project will appear here when issued.':'Las facturas del proyecto aparecerán aquí cuando se emitan.','Sprint progress reports and deployment notices for this project will appear here.':'Aquí aparecerán los informes de sprint y avisos de despliegue del proyecto.','No Updates Posted':'Aún no hay actualizaciones','No Shared Files':'Aún no hay archivos compartidos','Architecture diagrams, specifications, and release bundles shared by your team will appear here.':'Aquí aparecerán los diagramas de arquitectura, especificaciones y entregas compartidas por su equipo.','Quotes & Offers':'Presupuestos y ofertas','Review project proposals, commercial scope, and authorize engagement kickoff.':'Revise las propuestas y el alcance comercial y autorice el inicio del proyecto.','Created':'Creada','Valid until':'Válida hasta','Open':'Abiertas','Accepted':'Aceptadas','Closed':'Cerradas','No Offers in This View':'No hay ofertas en esta vista','Maintenance & Retainers':'Mantenimiento y retainers','Monitor active SLA plans, recurring engineering retainers, and maintenance billing.':'Consulte los acuerdos SLA, los servicios recurrentes y la facturación del mantenimiento.','Plan / Service':'Plan / servicio','Linked Project':'Proyecto asociado','Cadence':'Frecuencia','Next Billing':'Próxima facturación','Rate':'Tarifa','Account-wide':'Toda la cuenta','No Maintenance Contracts':'No hay contratos de mantenimiento','Active retainer agreements and post-launch SLA coverage will appear here.':'Aquí aparecerán los contratos activos y la cobertura posterior al lanzamiento.','Ongoing software maintenance and SLA coverage':'Mantenimiento continuo del software y cobertura SLA','Invoice #':'Número de factura','Contract':'Contrato','Payment':'Pago','Paid':'Pagada','No Maintenance Invoices':'No hay facturas de mantenimiento','Recurring and on-demand retainer invoices will appear here once billed.':'Aquí aparecerán las facturas recurrentes y bajo demanda cuando se emitan.','Active Care Plans':'Planes de soporte activos','Monthly Retainer Rate':'Tarifa mensual del retainer','Active monthly commitments':'Servicios mensuales activos','Open Maintenance Invoices':'Facturas de mantenimiento pendientes','Active Maintenance Contracts':'Contratos de mantenimiento activos','Maintenance Invoices':'Facturas de mantenimiento','Billing & Invoices':'Facturación y facturas','Consolidated ledger of project milestones, invoices, and maintenance payments.':'Resumen de hitos, facturas y pagos de mantenimiento.','Reference':'Referencia','Item & Project':'Concepto y proyecto','Action':'Acción','All':'Todas','Unpaid':'Pendientes','Paid':'Pagadas','No Billing Records Found':'No hay registros de facturación','Project milestone charges, invoices, and maintenance bills will appear here.':'Aquí aparecerán los hitos, facturas y cargos de mantenimiento.','Due':'Vence','Chronological sprint progress and engineering notes across your projects.':'Progreso cronológico de los sprints y notas técnicas de sus proyectos.','All Projects':'Todos los proyectos','No Delivery Updates Yet':'Aún no hay novedades','Weekly sprint summaries and engineering release notes will appear here.':'Aquí aparecerán resúmenes semanales de sprint y notas de versiones.','Secure access to specifications, technical deliverables, and project documentation.':'Acceso seguro a especificaciones, entregas técnicas y documentación del proyecto.','Document Name':'Nombre del documento','Project':'Proyecto','Type':'Tipo','Size':'Tamaño','Shared On':'Compartido el','Search files or projects…':'Buscar archivos o proyectos…','No Shared Documents Yet':'Aún no hay documentos compartidos','Try clearing your search filter to inspect all project files.':'Quite el filtro de búsqueda para ver todos los archivos del proyecto.','Contracts, technical specifications, and delivery packages shared with you will appear here.':'Aquí aparecerán contratos, especificaciones técnicas y entregas compartidas.','Profile & Security':'Perfil y seguridad','Manage your organization details, contact preferences, and account password.':'Gestione los datos de su empresa, sus preferencias de contacto y su contraseña.','Saving…':'Guardando…','Updating…':'Actualizando…','Profile saved successfully.':'Perfil guardado correctamente.','Password updated. Use it on your next sign-in.':'Contraseña actualizada. Úsela en su próximo inicio de sesión.','% complete':'% completado','Download failed.':'No se pudo descargar el archivo.','Unable to download file.':'No se pudo descargar el archivo.','Payment checkout URL was not returned.':'No se recibió la URL de pago.','Please sign in to access your client workspace.':'Inicie sesión para acceder al espacio de cliente.','Unable to load portal data.':'No se pudieron cargar los datos del portal.','PayPal maintenance payment confirmed and recorded.':'El pago de mantenimiento con PayPal se confirmó y registró.','PayPal capture is pending verification.':'El pago de PayPal está pendiente de verificación.','Payment completed. Invoice status updates automatically once confirmed.':'Pago completado. La factura se actualizará automáticamente al confirmarse.','Checkout was cancelled. No charge was made.':'Se canceló el pago. No se realizó ningún cargo.','Dismiss':'Cerrar','Unknown':'Desconocido','In Progress':'En curso','On Hold':'En pausa','Client Review':'Revisión del cliente','Testing':'En pruebas','Completed':'Completado','Cancelled':'Cancelado','Draft':'Borrador','Sent':'Enviada','Rejected':'Rechazada','Expired':'Vencida','Pending':'Pendiente','Overdue':'Vencida','Approved':'Aprobado','Submitted':'Enviado','Revision Requested':'Cambios solicitados','Payment Pending':'Pago pendiente','Failed':'Fallido','Active':'Activo','PayPal':'PayPal','Stripe':'Stripe','Your project workspace will appear automatically once you accept an open offer.':'Su espacio de proyecto aparecerá al aceptar una oferta.','Projects assigned to your company account will appear here.':'Aquí aparecerán los proyectos asignados a su empresa.'
});
Object.assign(PORTAL_LANGUAGE_COPY.de, {
  'Workspace active':'Arbeitsbereich aktiv','Active RSTechwerk delivery workspace.':'Aktiver Projektbereich von RSTechwerk.','Maintenance Retainer':'Wartungs-Retainer','Client Sign-In Required':'Anmeldung im Kundenportal erforderlich','Staff Account Detected':'Mitarbeiterkonto erkannt','Unable to Load Workspace':'Arbeitsbereich konnte nicht geladen werden','You are signed in with an administrator account that does not have an associated client profile. Open the Admin Console or sign in with a client account.':'Sie sind mit einem Administratorkonto ohne Kundenprofil angemeldet. Öffnen Sie die Admin-Konsole oder melden Sie sich mit einem Kundenkonto an.','Open Admin Console':'Admin-Konsole öffnen','Switch Account':'Konto wechseln','Sign In to Portal':'Im Portal anmelden','Create Client Account':'Kundenkonto erstellen',
  'Receipt':'Beleg','PDF':'PDF','Download PDF Receipt':'PDF-Beleg herunterladen','View Receipt':'Beleg ansehen','Download PDF':'PDF herunterladen','Payment Receipt':'Zahlungsbeleg','Official Payment Proof':'Offizieller Zahlungsnachweis','Total Amount Paid':'Bezahlter Gesamtbetrag','Payment Purpose':'Zahlungszweck','Payment Method':'Zahlungsmethode','Paid Date & Time':'Zahlungsdatum & -uhrzeit','Received From (Client)':'Erhalten von (Kunde)','Receipt & Issuer Details':'Beleg- & Ausstellerdaten','Receipt No.':'Beleg-Nr.','Reference ID':'Referenz-ID','Currency':'Währung','Payment Gateway':'Zahlungsanbieter','Transaction Ref':'Transaktionsreferenz','Issuer Email':'Aussteller-E-Mail','Subtotal':'Zwischensumme','Currency Settled':'Beglichene Währung','Total Paid':'Gesamt bezahlt','Status: Paid in Full · Balance Due: 0.00':'Status: Vollständig bezahlt · Offener Betrag: 0,00','Official Payment Confirmation':'Offizielle Zahlungsbestätigung','Total Settled':'Bereits bezahlt','Paid Receipts':'Bezahlte Belege','Close':'Schließen','PayPal milestone payment confirmed and recorded.':'PayPal-Meilensteinzahlung bestätigt und verbucht.','Payment verified and recorded.':'Zahlung bestätigt und verbucht.','Loading payment receipt…':'Zahlungsbeleg wird geladen…','Unable to load payment receipt.':'Zahlungsbeleg konnte nicht geladen werden.'
});
Object.assign(PORTAL_LANGUAGE_COPY.es, {
  'Workspace active':'Espacio activo','Active RSTechwerk delivery workspace.':'Espacio de proyectos activo de RSTechwerk.','Maintenance Retainer':'Servicio de mantenimiento','Client Sign-In Required':'Se requiere iniciar sesión en el portal','Staff Account Detected':'Se ha detectado una cuenta de equipo','Unable to Load Workspace':'No se pudo cargar el espacio de trabajo','You are signed in with an administrator account that does not have an associated client profile. Open the Admin Console or sign in with a client account.':'Ha iniciado sesión con una cuenta de administrador sin perfil de cliente asociado. Abra la consola de administración o use una cuenta de cliente.','Open Admin Console':'Abrir consola de administración','Switch Account':'Cambiar de cuenta','Sign In to Portal':'Iniciar sesión en el portal','Create Client Account':'Crear cuenta de cliente',
  'Receipt':'Recibo','PDF':'PDF','Download PDF Receipt':'Descargar recibo PDF','View Receipt':'Ver recibo','Download PDF':'Descargar PDF','Payment Receipt':'Recibo de pago','Official Payment Proof':'Comprobante oficial de pago','Total Amount Paid':'Importe total pagado','Payment Purpose':'Concepto del pago','Payment Method':'Método de pago','Paid Date & Time':'Fecha y hora del pago','Received From (Client)':'Recibido de (Cliente)','Receipt & Issuer Details':'Datos del recibo y emisor','Receipt No.':'N.º de recibo','Reference ID':'ID de referencia','Currency':'Moneda','Payment Gateway':'Pasarela de pago','Transaction Ref':'Ref. de transacción','Issuer Email':'Correo del emisor','Subtotal':'Subtotal','Currency Settled':'Moneda liquidada','Total Paid':'Total pagado','Status: Paid in Full · Balance Due: 0.00':'Estado: Pagado en su totalidad · Saldo pendiente: 0,00','Official Payment Confirmation':'Confirmación oficial de pago','Total Settled':'Total pagado','Paid Receipts':'Recibos pagados','Close':'Cerrar','PayPal milestone payment confirmed and recorded.':'El pago del hito con PayPal se confirmó y registró.','Payment verified and recorded.':'Pago verificado y registrado.','Loading payment receipt…':'Cargando recibo de pago…','Unable to load payment receipt.':'No se pudo cargar el recibo de pago.'
});
window.RSTechwerkPortalLanguageCopy = PORTAL_LANGUAGE_COPY;
const PORTAL_ORIGINAL_TEXT = new WeakMap();
const PORTAL_ORIGINAL_ATTRIBUTES = new WeakMap();
function applyPortalLanguage(language) {
  const translations = PORTAL_LANGUAGE_COPY[language] || {};
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach((node) => {
    if (!PORTAL_ORIGINAL_TEXT.has(node)) PORTAL_ORIGINAL_TEXT.set(node, node.nodeValue);
    const source = PORTAL_ORIGINAL_TEXT.get(node);
    const trimmed = source.trim();
    const translated = translatePortalText(source, translations);
    if (node.nodeValue !== translated) node.nodeValue = translated;
  });
  document.querySelectorAll('[placeholder], [aria-label]').forEach((element) => {
    if (!PORTAL_ORIGINAL_ATTRIBUTES.has(element)) PORTAL_ORIGINAL_ATTRIBUTES.set(element, {});
    const originals = PORTAL_ORIGINAL_ATTRIBUTES.get(element);
    for (const attribute of ['placeholder', 'aria-label']) {
      if (!element.hasAttribute(attribute)) continue;
      if (!(attribute in originals)) originals[attribute] = element.getAttribute(attribute);
      const original = originals[attribute];
      if (PORTAL_LANGUAGE_COPY.de[original] || PORTAL_LANGUAGE_COPY.es[original]) element.setAttribute(attribute, translations[original] || original);
    }
  });
  document.documentElement.lang = language;
}
function translatePortalText(source, translations) {
  const trimmed = source.trim();
  if (translations[trimmed]) return source.replace(trimmed, translations[trimmed]);
  let translated = source;
  const keys = Object.keys(translations).filter((key) => key.length > 2).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    if (!translated.includes(key)) continue;
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    translated = translated.replace(new RegExp(`(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`, 'giu'), translations[key]);
  }
  return translated;
}
function initPortalLanguage() {
  const selector = document.getElementById('portalLanguageSelect');
  const language = localStorage.getItem('tecklumo-language') || 'en';
  if (selector) { selector.value = language; selector.addEventListener('change', (event) => {
    const nextLanguage = event.target.value;
    localStorage.setItem('tecklumo-language', nextLanguage);
    applyPortalLanguage(nextLanguage);
    if (portalState.profile) {
      const active = document.activeElement;
      const activeKey = active?.id || active?.name;
      const values = [...document.querySelectorAll('#portalContent input, #portalContent select, #portalContent textarea')]
        .filter((field) => field.id || field.name)
        .map((field) => ({ key: field.id || field.name, value: field.type === 'checkbox' ? field.checked : field.value, checked: field.type === 'checkbox' }));
      renderCurrentView();
      values.forEach(({ key, value, checked }) => {
        const field = document.getElementById(key) || document.querySelector(`#portalContent [name="${CSS.escape(key)}"]`);
        if (field) { if (checked) field.checked = value; else if (field.type !== 'file') field.value = value; }
      });
      if (activeKey) (document.getElementById(activeKey) || document.querySelector(`#portalContent [name="${CSS.escape(activeKey)}"]`))?.focus();
      applyPortalLanguage(nextLanguage);
    }
  }); }
  applyPortalLanguage(language);
  const observer = new MutationObserver(() => applyPortalLanguage(localStorage.getItem('tecklumo-language') || 'en'));
  if (content) observer.observe(content, { childList:true, subtree:true });
}

const content = document.getElementById('portalContent');
const paymentBannerEl = document.getElementById('portalPaymentBanner');
const breadcrumbTitleEl = document.getElementById('topbarBreadcrumbTitle');

const TAB_LABELS = {
  overview: 'Overview',
  projects: 'Projects & Milestones',
  offers: 'Quotes & Offers',
  maintenance: 'Maintenance & Retainers',
  billing: 'Billing & Invoices',
  updates: 'Delivery Updates',
  documents: 'Documents',
  profile: 'Profile & Security'
};

const portalState = {
  profile: null,
  projects: [],
  proposals: [],
  maintenance: [],
  maintenanceInvoices: [],
  activeTab: 'overview',
  selectedProjectId: null,
  projectSubTab: 'milestones',
  offerFilter: 'all',
  billingFilter: 'all',
  documentQuery: '',
  updateProjectFilter: 'all'
};

function escapeHtml(value) {
  const div = document.createElement('div');
  div.textContent = value == null ? '' : String(value);
  return div.innerHTML;
}

function formatMoney(amount, currency = 'EUR') {
  const num = Number(amount || 0);
  const code = String(currency || 'EUR').toUpperCase();
  const locale = { en: 'en-US', de: 'de-DE', es: 'es-ES' }[localStorage.getItem('tecklumo-language')] || 'en-US';
  return `${escapeHtml(code)} ${num.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return escapeHtml(value);
  const locale = { en: 'en-GB', de: 'de-DE', es: 'es-ES' }[localStorage.getItem('tecklumo-language')] || 'en-GB';
  return date.toLocaleDateString(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

function formatStatusLabel(status) {
  if (!status) return 'Unknown';
  return String(status)
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (ch) => ch.toUpperCase());
}

function getStatusVariant(status) {
  const s = String(status || '').toLowerCase();
  if (['paid', 'approved', 'accepted', 'completed', 'active'].includes(s)) return 'success';
  if (['submitted', 'sent', 'client_review', 'testing', 'in_progress'].includes(s)) return 'info';
  if (['pending', 'payment_pending', 'draft', 'on_hold', 'revision_requested'].includes(s)) return 'warn';
  if (['overdue', 'rejected', 'cancelled', 'expired', 'failed'].includes(s)) return 'danger';
  return '';
}

function renderStatusTag(status) {
  const variant = getStatusVariant(status);
  return `<span class="status-tag ${variant}">${escapeHtml(formatStatusLabel(status))}</span>`;
}

function getFileExtension(name) {
  const parts = String(name || '').split('.');
  return parts.length > 1 ? parts.pop().toUpperCase().slice(0, 4) : 'FILE';
}

function formatDateTime(value) {
  if (!value) return 'Verified';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return escapeHtml(value);
  const locale = { en: 'en-GB', de: 'de-DE', es: 'es-ES' }[localStorage.getItem('tecklumo-language')] || 'en-GB';
  return date.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC'
  }) + ' UTC';
}

function formatProviderShort(provider) {
  const norm = String(provider || '').trim().toLowerCase();
  if (norm === 'stripe') return 'Stripe';
  if (norm === 'paypal') return 'PayPal';
  if (norm === 'bank' || norm === 'bank_transfer' || norm === 'sepa') return 'Bank Transfer';
  return 'Direct Settlement';
}

function renderPaidReceiptControls(type, id, paidAt, paymentProvider) {
  return `
    <div class="paid-action-group">
      <span class="paid-meta-note">${escapeHtml(formatProviderShort(paymentProvider))} · ${formatDate(paidAt)}</span>
      <button type="button" class="btn btn-secondary btn-sm open-receipt-modal" data-receipt-type="${escapeHtml(type)}" data-receipt-id="${escapeHtml(id)}">Receipt</button>
      <button type="button" class="btn btn-primary btn-sm download-receipt-pdf" data-receipt-type="${escapeHtml(type)}" data-receipt-id="${escapeHtml(id)}">PDF</button>
    </div>
  `;
}

async function downloadReceiptPdf(type, id, triggerBtn) {
  if (!session?.token) {
    showPaymentBanner('danger', 'Please sign in to download your payment receipt.');
    return;
  }
  const originalLabel = triggerBtn ? triggerBtn.innerHTML : '';
  if (triggerBtn) triggerBtn.disabled = true;
  try {
    const response = await fetch(`/api/receipts/${encodeURIComponent(type)}/${encodeURIComponent(id)}/pdf`, {
      headers: { Authorization: `Bearer ${session.token}` }
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || 'Unable to generate PDF receipt.');
    }
    const disposition = response.headers.get('Content-Disposition') || '';
    const match = disposition.match(/filename="([^"]+)"/i);
    const filename = match ? match[1] : `RSTechwerk-Receipt-${type}.pdf`;
    const blobUrl = URL.createObjectURL(await response.blob());
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
  } catch (error) {
    showPaymentBanner('danger', error.message || 'Unable to download PDF receipt.');
  } finally {
    if (triggerBtn) {
      triggerBtn.disabled = false;
      triggerBtn.innerHTML = originalLabel;
    }
  }
}

function closeReceiptModal() {
  const modal = document.getElementById('receiptPreviewModal');
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function buildReceiptEmblemSvg() {
  return `
    <svg class="receipt-brand-emblem" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="receipt-rs-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0b1320" />
          <stop offset="100%" stop-color="#041f17" />
        </linearGradient>
        <linearGradient id="receipt-rs-glow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#10b981" />
          <stop offset="50%" stop-color="#06b6d4" />
          <stop offset="100%" stop-color="#3b82f6" />
        </linearGradient>
        <linearGradient id="receipt-rs-accent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#34d399" />
          <stop offset="100%" stop-color="#38bdf8" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="34" height="34" rx="9" fill="url(#receipt-rs-bg)" stroke="url(#receipt-rs-glow)" stroke-width="1.5" />
      <circle cx="28" cy="8" r="1.75" fill="#38bdf8" />
      <path d="M26 8H22" stroke="#38bdf8" stroke-width="1.25" stroke-linecap="round" />
      <path d="M9 26V10H16C18.4853 10 20.5 12.0147 20.5 14.5C20.5 16.9853 18.4853 19 16 19H9M14.5 19L21 26" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M23 13C23 13 26 13 27 14.2C28 15.4 26.8 17 24.8 17.6C22.8 18.2 21.8 19.8 22.8 21.2C23.8 22.6 26.5 22.5 27.5 22" stroke="url(#receipt-rs-accent)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  `;
}

async function openReceiptModal(type, id) {
  const modal = document.getElementById('receiptPreviewModal');
  const bodyEl = document.getElementById('receiptModalBody');
  const headingEl = document.getElementById('receiptModalHeading');
  const kickerEl = document.getElementById('receiptModalKicker');
  const dlBtn = document.getElementById('receiptModalDownloadBtn');
  if (!modal || !bodyEl) return;

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  if (headingEl) headingEl.textContent = 'Payment Receipt';
  if (kickerEl) kickerEl.textContent = 'Official Payment Proof';
  if (dlBtn) {
    dlBtn.disabled = true;
    dlBtn.dataset.receiptType = type;
    dlBtn.dataset.receiptId = id;
  }
  bodyEl.innerHTML = `<div class="receipt-sheet" style="text-align:center;padding:3rem 1.5rem;color:#64748b;">Loading payment receipt…</div>`;

  try {
    const result = await portalFetch(`/api/receipts/${encodeURIComponent(type)}/${encodeURIComponent(id)}`);
    const receipt = result.receipt;
    if (!receipt) throw new Error('Unable to load payment receipt.');

    if (headingEl) headingEl.textContent = receipt.receiptNumber;
    if (kickerEl) kickerEl.textContent = receipt.typeLabel || 'Official Payment Proof';
    if (dlBtn) dlBtn.disabled = false;

    const clientLocation = [receipt.client.address, receipt.client.postalCode, receipt.client.city, receipt.client.country]
      .filter(Boolean)
      .join(', ');

    const milestoneBoxHtml = receipt.milestoneBreakdown
      ? `
        <div class="receipt-milestone-box">
          <strong>PROJECT MILESTONE SCHEDULE (${receipt.milestoneBreakdown.milestoneNumber} OF ${receipt.milestoneBreakdown.milestoneCount})</strong>
          <div>This milestone settled: <b>${formatMoney(receipt.milestoneBreakdown.milestoneAmount, receipt.currency)}</b></div>
          <div>Total project milestones: ${formatMoney(receipt.milestoneBreakdown.projectMilestonesTotal, receipt.currency)} · Paid to date: ${formatMoney(receipt.milestoneBreakdown.projectPaidTotal, receipt.currency)}</div>
          <div>Remaining milestone balance: ${formatMoney(receipt.milestoneBreakdown.projectRemainingTotal, receipt.currency)}</div>
        </div>
      `
      : '';

    const officesHtml = (receipt.company.offices || []).length
      ? receipt.company.offices
          .slice(0, 3)
          .map(
            (office) => `
          <div>
            <strong>${escapeHtml(office.officeLabel)} (${escapeHtml(office.country)})</strong>
            <div>${escapeHtml([office.streetAddress, office.postalCity].filter(Boolean).join(', '))}</div>
            ${office.phone || office.email ? `<div>${escapeHtml([office.phone, office.email].filter(Boolean).join(' · '))}</div>` : ''}
          </div>
        `
          )
          .join('')
      : `<div><strong>${escapeHtml(receipt.company.companyName)}</strong><div>${escapeHtml(receipt.company.companyEmail)} · ${escapeHtml(receipt.company.companyWebsite)}</div></div>`;

    const companyRaw = String(receipt.company.companyName || 'RSTechwerk');
    const brandHtml = companyRaw.startsWith('RS')
      ? `<span class="rs">RS</span>${escapeHtml(companyRaw.slice(2))}`
      : escapeHtml(companyRaw);

    bodyEl.innerHTML = `
      <div class="receipt-sheet">
        <div class="receipt-brand-row">
          <div class="receipt-brand-lockup">
            ${buildReceiptEmblemSvg()}
            <div>
              <div class="receipt-brand-name">${brandHtml}</div>
              <div class="receipt-brand-tagline">Software Engineering &amp; Digital Delivery · ${escapeHtml(String(receipt.company.companyWebsite || '').replace(/^https?:\/\//, ''))}</div>
            </div>
          </div>
          <div class="receipt-title-block">
            <div class="receipt-doc-title">PAYMENT RECEIPT</div>
            <span class="receipt-status-stamp">PAID · VERIFIED</span>
          </div>
        </div>

        <div class="receipt-proof-strip">
          <div class="receipt-proof-cell">
            <span class="receipt-proof-label">Total Amount Paid</span>
            <span class="receipt-proof-val accent">${formatMoney(receipt.amount, receipt.currency)}</span>
            <span class="receipt-proof-sub">${escapeHtml(receipt.currencyLabel)}</span>
          </div>
          <div class="receipt-proof-cell">
            <span class="receipt-proof-label">Payment Purpose</span>
            <span class="receipt-proof-val">${escapeHtml(receipt.typeLabel)}</span>
            <span class="receipt-proof-sub">${escapeHtml(receipt.projectName || 'Client Workspace')}</span>
          </div>
          <div class="receipt-proof-cell">
            <span class="receipt-proof-label">Payment Method</span>
            <span class="receipt-proof-val">${escapeHtml(receipt.paymentMethodLabel)}</span>
            <span class="receipt-proof-sub">Ref: ${escapeHtml(String(receipt.transactionReference).slice(0, 26))}</span>
          </div>
          <div class="receipt-proof-cell">
            <span class="receipt-proof-label">Paid Date &amp; Time</span>
            <span class="receipt-proof-val">${formatDate(receipt.paidAt)}</span>
            <span class="receipt-proof-sub">${formatDateTime(receipt.paidAt)}</span>
          </div>
        </div>

        <div class="receipt-parties-grid">
          <div>
            <div class="receipt-section-kicker">Received From (Client)</div>
            <div class="receipt-client-company">${escapeHtml(receipt.client.companyName)}</div>
            <div class="receipt-client-lines">
              <div>Attn: ${escapeHtml(receipt.client.contactName)}</div>
              <div>${escapeHtml(receipt.client.email)}</div>
              ${receipt.client.phone ? `<div>Phone: ${escapeHtml(receipt.client.phone)}</div>` : ''}
              ${clientLocation ? `<div>${escapeHtml(clientLocation)}</div>` : ''}
            </div>
          </div>
          <div>
            <div class="receipt-section-kicker">Receipt &amp; Issuer Details</div>
            <div class="receipt-meta-rows">
              <div class="receipt-meta-row"><span>Receipt No.</span><strong>${escapeHtml(receipt.receiptNumber)}</strong></div>
              <div class="receipt-meta-row"><span>Reference ID</span><strong>${escapeHtml(receipt.referenceCode)}</strong></div>
              <div class="receipt-meta-row"><span>Currency</span><strong>${escapeHtml(receipt.currencyLabel)}</strong></div>
              <div class="receipt-meta-row"><span>Payment Gateway</span><strong>${escapeHtml(receipt.paymentMethodLabel)}</strong></div>
              <div class="receipt-meta-row"><span>Transaction Ref</span><strong>${escapeHtml(receipt.transactionReference)}</strong></div>
              <div class="receipt-meta-row"><span>Issuer Email</span><strong>${escapeHtml(receipt.company.companyEmail)}</strong></div>
            </div>
          </div>
        </div>

        <div class="receipt-table-wrap">
          <table class="receipt-table">
            <thead>
              <tr>
                <th>Item &amp; Description</th>
                <th>Type / Currency</th>
                <th>Due / Period</th>
                <th class="text-right">Paid Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong style="color:#0f172a;display:block;">${escapeHtml(receipt.itemTitle)}</strong>
                  <span style="font-size:0.78rem;color:#475569;">${escapeHtml(receipt.projectName)}${receipt.itemDescription ? ` — ${escapeHtml(receipt.itemDescription)}` : ''}</span>
                </td>
                <td>
                  <strong style="color:#0f172a;display:block;">${receipt.type === 'milestone' ? 'Milestone' : receipt.type === 'maintenance' ? 'Retainer' : 'Invoice'}</strong>
                  <span style="font-size:0.76rem;color:#64748b;">${escapeHtml(receipt.currency)}</span>
                </td>
                <td class="tabular-nums">${escapeHtml(receipt.periodText || formatDate(receipt.dueDate))}</td>
                <td class="text-right" style="font-family:var(--font-mono);font-weight:700;color:#0f172a;white-space:nowrap;">${formatMoney(receipt.amount, receipt.currency)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="receipt-bottom-split">
          ${milestoneBoxHtml}
          <div class="receipt-totals-box">
            <div class="receipt-total-row"><span>Subtotal</span><span class="tabular-nums">${formatMoney(receipt.amount, receipt.currency)}</span></div>
            <div class="receipt-total-row"><span>Currency Settled</span><span>${escapeHtml(receipt.currency)}</span></div>
            <div class="receipt-total-grand"><span>Total Paid</span><span class="amount tabular-nums">${formatMoney(receipt.amount, receipt.currency)}</span></div>
            <div class="receipt-paid-note">Status: Paid in Full · Balance Due: 0.00</div>
          </div>
        </div>

        <div class="receipt-verified-box">
          <strong>Official Payment Confirmation</strong>
          This receipt confirms that ${escapeHtml(receipt.company.companyName)} received ${formatMoney(receipt.amount, receipt.currency)} via ${escapeHtml(receipt.paymentMethodLabel)} for "${escapeHtml(receipt.itemTitle)}" (${escapeHtml(receipt.projectName)}). Download the signed PDF for accounting and audit records.
        </div>

        <div class="receipt-office-footer">${officesHtml}</div>
      </div>
    `;
  } catch (error) {
    bodyEl.innerHTML = `<div class="receipt-sheet" style="text-align:center;padding:2.5rem 1.5rem;color:#dc2626;">${escapeHtml(error.message || 'Unable to load payment receipt.')}</div>`;
  }
}

function initReceiptModalShell() {
  const modal = document.getElementById('receiptPreviewModal');
  if (!modal) return;
  document.getElementById('receiptModalCloseBtn')?.addEventListener('click', closeReceiptModal);
  document.getElementById('receiptModalDownloadBtn')?.addEventListener('click', (event) => {
    const btn = event.currentTarget;
    if (btn.dataset.receiptType && btn.dataset.receiptId) {
      downloadReceiptPdf(btn.dataset.receiptType, btn.dataset.receiptId, btn);
    }
  });
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeReceiptModal();
  });
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) {
      closeReceiptModal();
    }
  });
}

/* Theme & Drawer Controls
   ========================================================================== */
function initPortalTheme() {
  const saved = localStorage.getItem(PORTAL_THEME_KEY) || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  const icon = document.getElementById('portalThemeIcon');
  if (icon) icon.textContent = saved === 'dark' ? '☀' : '☾';

  document.getElementById('portalThemeToggle')?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(PORTAL_THEME_KEY, next);
    if (icon) icon.textContent = next === 'dark' ? '☀' : '☾';
  });
}

function closeMobileSidebar() {
  document.getElementById('portalSidebar')?.classList.remove('open');
  document.getElementById('sidebarBackdrop')?.classList.remove('open');
}

function initSidebarShell() {
  document.getElementById('mobileMenuBtn')?.addEventListener('click', () => {
    document.getElementById('portalSidebar')?.classList.add('open');
    document.getElementById('sidebarBackdrop')?.classList.add('open');
  });
  document.getElementById('sidebarCloseBtn')?.addEventListener('click', closeMobileSidebar);
  document.getElementById('sidebarBackdrop')?.addEventListener('click', closeMobileSidebar);

  document.querySelectorAll('[data-portal-nav]').forEach((btn) => {
    btn.addEventListener('click', () => {
      switchTab(btn.dataset.portalNav);
      closeMobileSidebar();
    });
  });

  document.getElementById('topbarProfileBtn')?.addEventListener('click', () => {
    switchTab('profile');
  });
}

function resolveInitialTabFromHash() {
  const hash = window.location.hash.replace('#', '');
  if (hash === 'profileForm' || hash === 'profile') return 'profile';
  if (TAB_LABELS[hash]) return hash;
  return 'overview';
}

function switchTab(tabName, options = {}) {
  if (!TAB_LABELS[tabName]) tabName = 'overview';
  portalState.activeTab = tabName;
  if (options.projectId) {
    portalState.selectedProjectId = options.projectId;
  }
  if (options.projectSubTab) {
    portalState.projectSubTab = options.projectSubTab;
  }

  document.querySelectorAll('[data-portal-nav]').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.portalNav === tabName);
  });

  if (breadcrumbTitleEl) {
    breadcrumbTitleEl.textContent = TAB_LABELS[tabName] || 'Overview';
  }

  renderCurrentView();
}

/* API Helper
   ========================================================================== */
async function portalFetch(path, options = {}) {
  if (!session?.token) {
    const err = new Error('Please sign in to access your client workspace.');
    err.code = 401;
    throw err;
  }
  const response = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.token}`,
      ...(options.headers || {})
    }
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const err = new Error(result.message || 'Unable to load portal data.');
    err.code = response.status;
    throw err;
  }
  return result;
}

/* Payment Return Callbacks
   ========================================================================== */
async function handlePaymentReturnParams() {
  if (!paymentBannerEl) return;
  const params = new URLSearchParams(window.location.search);

  if (params.get('paypal') === 'success' && params.get('project') && params.get('milestone')) {
    const projectId = params.get('project');
    const milestoneId = params.get('milestone');
    try {
      await portalFetch(
        `/api/projects/${encodeURIComponent(projectId)}/milestones/${encodeURIComponent(milestoneId)}/paypal/capture`,
        { method: 'POST' }
      );
      showPaymentBanner('success', 'PayPal milestone payment confirmed and recorded.', {
        receiptType: 'milestone',
        receiptId: milestoneId
      });
    } catch (error) {
      showPaymentBanner('warn', error.message || 'PayPal capture is pending verification.');
    }
    window.history.replaceState({}, '', window.location.pathname + window.location.hash);
    return;
  }

  if (params.get('paypalMaintenance') === 'success' && params.get('invoice')) {
    const invoiceId = params.get('invoice');
    try {
      await portalFetch(`/api/maintenance/invoices/${encodeURIComponent(invoiceId)}/paypal/capture`, {
        method: 'POST'
      });
      showPaymentBanner('success', 'PayPal maintenance payment confirmed and recorded.', {
        receiptType: 'maintenance',
        receiptId: invoiceId
      });
    } catch (error) {
      showPaymentBanner('warn', error.message || 'PayPal capture is pending verification.');
    }
    window.history.replaceState({}, '', window.location.pathname + window.location.hash);
    return;
  }

  if (
    (params.get('payment') === 'success' || params.get('maintenancePayment') === 'success') &&
    params.get('session_id')
  ) {
    const sessionId = params.get('session_id');
    try {
      const result = await portalFetch('/api/payments/stripe/verify-session', {
        method: 'POST',
        body: JSON.stringify({ sessionId })
      });
      if (result.verified && result.receiptType && result.receiptId) {
        showPaymentBanner('success', 'Payment verified and recorded.', {
          receiptType: result.receiptType,
          receiptId: result.receiptId
        });
      } else {
        showPaymentBanner('success', 'Payment completed. Invoice status updates automatically once confirmed.');
      }
    } catch {
      showPaymentBanner('success', 'Payment completed. Invoice status updates automatically once confirmed.');
    }
    window.history.replaceState({}, '', window.location.pathname + window.location.hash);
    return;
  }

  if (params.get('payment') === 'success' || params.get('maintenancePayment') === 'success' || params.get('paypal') === 'success') {
    const fallbackReceipt = params.get('milestone')
      ? { receiptType: 'milestone', receiptId: params.get('milestone') }
      : params.get('invoice')
      ? { receiptType: 'maintenance', receiptId: params.get('invoice') }
      : null;
    showPaymentBanner('success', 'Payment completed. Invoice status updates automatically once confirmed.', fallbackReceipt);
    window.history.replaceState({}, '', window.location.pathname + window.location.hash);
  } else if (
    params.get('payment') === 'cancelled' ||
    params.get('maintenancePayment') === 'cancelled' ||
    params.get('paypal') === 'cancelled' ||
    params.get('paypalMaintenance') === 'cancelled'
  ) {
    showPaymentBanner('warn', 'Checkout was cancelled. No charge was made.');
    window.history.replaceState({}, '', window.location.pathname + window.location.hash);
  }
}

function showPaymentBanner(variant, message, receiptRef = null) {
  if (!paymentBannerEl) return;
  const receiptActionsHtml =
    receiptRef?.receiptType && receiptRef?.receiptId
      ? `
        <button type="button" class="btn btn-secondary btn-sm open-receipt-modal" data-receipt-type="${escapeHtml(receiptRef.receiptType)}" data-receipt-id="${escapeHtml(receiptRef.receiptId)}">View Receipt</button>
        <button type="button" class="btn btn-primary btn-sm download-receipt-pdf" data-receipt-type="${escapeHtml(receiptRef.receiptType)}" data-receipt-id="${escapeHtml(receiptRef.receiptId)}">Download PDF</button>
      `
      : '';
  paymentBannerEl.innerHTML = `
    <div class="portal-banner ${variant}">
      <span>${escapeHtml(message)}</span>
      <div style="display:flex;align-items:center;gap:0.45rem;flex-wrap:wrap;">
        ${receiptActionsHtml}
        <button type="button" class="btn btn-ghost btn-sm" id="dismissPaymentBanner">Dismiss</button>
      </div>
    </div>
  `;
  document.getElementById('dismissPaymentBanner')?.addEventListener('click', () => {
    paymentBannerEl.innerHTML = '';
  });
}

/* Sidebar Counts & Account Footer
   ========================================================================== */
function updateSidebarChrome() {
  const { profile, projects, proposals, maintenance, maintenanceInvoices } = portalState;

  if (profile) {
    const card = document.getElementById('sidebarAccountCard');
    const avatar = document.getElementById('sidebarAvatar');
    const nameEl = document.getElementById('sidebarContactName');
    const companyEl = document.getElementById('sidebarCompanyName');

    const initials = (profile.contactName || profile.companyName || 'CL')
      .split(/\s+/)
      .slice(0, 2)
      .map((s) => s[0])
      .join('')
      .toUpperCase();

    if (card) card.style.display = 'flex';
    if (avatar) avatar.textContent = initials || 'CL';
    if (nameEl) nameEl.textContent = profile.contactName || 'Client';
    if (companyEl) companyEl.textContent = profile.companyName || profile.email || '';
  }

  const activeProjectsCount = projects.filter((p) => !['completed', 'cancelled'].includes(p.status)).length;
  const openOffersCount = proposals.filter((p) => ['draft', 'sent'].includes(p.status)).length;
  const activeMaintCount = maintenance.filter((m) => m.status === 'active').length;

  const unpaidMilestones = projects.reduce(
    (sum, p) => sum + (p.milestones || []).filter((m) => Number(m.amount) > 0 && m.status !== 'paid').length,
    0
  );
  const unpaidProjectInvoices = projects.reduce(
    (sum, p) => sum + (p.invoices || []).filter((i) => i.status !== 'paid' && i.status !== 'cancelled').length,
    0
  );
  const unpaidMaintInvoices = maintenanceInvoices.filter((i) => i.status !== 'paid').length;
  const totalOpenBilling = unpaidMilestones + unpaidProjectInvoices + unpaidMaintInvoices;

  const totalDocs = projects.reduce((sum, p) => sum + (p.files || []).length, 0);

  const setNavCount = (id, count) => {
    const el = document.getElementById(id);
    if (el) el.textContent = count > 0 ? String(count) : '';
  };

  setNavCount('navCountProjects', activeProjectsCount);
  setNavCount('navCountOffers', openOffersCount);
  setNavCount('navCountMaintenance', activeMaintCount);
  setNavCount('navCountBilling', totalOpenBilling);
  setNavCount('navCountDocuments', totalDocs);
}

/* View Renderers
   ========================================================================== */
function renderCurrentView() {
  if (!portalState.profile) return;

  switch (portalState.activeTab) {
    case 'overview':
      renderOverviewView();
      break;
    case 'projects':
      renderProjectsView();
      break;
    case 'offers':
      renderOffersView();
      break;
    case 'maintenance':
      renderMaintenanceView();
      break;
    case 'billing':
      renderBillingView();
      break;
    case 'updates':
      renderUpdatesView();
      break;
    case 'documents':
      renderDocumentsView();
      break;
    case 'profile':
      renderProfileView();
      break;
    default:
      renderOverviewView();
  }
}

function renderOverviewView() {
  const { profile, projects, proposals, maintenance, maintenanceInvoices } = portalState;
  const activeProjects = projects.filter((p) => !['completed', 'cancelled'].includes(p.status));
  const openProposals = proposals.filter((p) => ['draft', 'sent'].includes(p.status));
  const avgProgress = activeProjects.length
    ? Math.round(activeProjects.reduce((sum, p) => sum + (Number(p.progress) || 0), 0) / activeProjects.length)
    : 0;

  // Calculate total balance due across unpaid milestones and maintenance invoices
  let balanceDue = 0;
  let primaryCurrency = 'EUR';
  const pendingActions = [];

  for (const proposal of openProposals) {
    primaryCurrency = proposal.currency || primaryCurrency;
    pendingActions.push({
      type: 'proposal',
      title: `Review Offer: ${proposal.title}`,
      meta: `Offered amount ${formatMoney(proposal.totalAmount, proposal.currency)} · ${
        proposal.expiresAt ? `Valid until ${formatDate(proposal.expiresAt)}` : 'Awaiting your decision'
      }`,
      actions: `
        <button class="btn btn-primary btn-sm proposal-decision" data-id="${escapeHtml(proposal.id)}" data-status="accepted">Accept Offer</button>
        <button class="btn btn-secondary btn-sm proposal-decision" data-id="${escapeHtml(proposal.id)}" data-status="rejected">Decline</button>
      `
    });
  }

  for (const project of projects) {
    for (const ms of project.milestones || []) {
      if (ms.status === 'submitted') {
        pendingActions.push({
          type: 'milestone-review',
          title: `Approve Deliverable: ${ms.title}`,
          meta: `${project.name} · Submitted for your review`,
          actions: `
            <button class="btn btn-primary btn-sm milestone-decision" data-project="${escapeHtml(project.id)}" data-milestone="${escapeHtml(ms.id)}" data-status="approved">Approve</button>
            <button class="btn btn-secondary btn-sm milestone-decision" data-project="${escapeHtml(project.id)}" data-milestone="${escapeHtml(ms.id)}" data-status="revision_requested">Request Revision</button>
          `
        });
      }
      if (Number(ms.amount) > 0 && ms.status !== 'paid') {
        balanceDue += Number(ms.amount);
        primaryCurrency = ms.currency || primaryCurrency;
        pendingActions.push({
          type: 'milestone-pay',
          title: `Milestone Payment: ${ms.title}`,
          meta: `${project.name} · ${formatMoney(ms.amount, ms.currency)}`,
          actions: `
            <button class="btn btn-primary btn-sm portal-pay" data-project="${escapeHtml(project.id)}" data-milestone="${escapeHtml(ms.id)}" data-provider="stripe">Pay with Stripe</button>
            <button class="btn btn-secondary btn-sm portal-pay" data-project="${escapeHtml(project.id)}" data-milestone="${escapeHtml(ms.id)}" data-provider="paypal">PayPal</button>
          `
        });
      }
    }
  }

  for (const inv of maintenanceInvoices) {
    if (inv.status !== 'paid') {
      balanceDue += Number(inv.amount || 0);
      primaryCurrency = inv.currency || primaryCurrency;
      pendingActions.push({
        type: 'maintenance-pay',
        title: `Maintenance Invoice ${inv.invoiceNumber}`,
        meta: `${inv.title} · ${formatMoney(inv.amount, inv.currency)} · Due ${formatDate(inv.dueDate)}`,
        actions: `
          <button class="btn btn-primary btn-sm maintenance-pay" data-provider="stripe" data-invoice="${escapeHtml(inv.id)}">Pay with Stripe</button>
          <button class="btn btn-secondary btn-sm maintenance-pay" data-provider="paypal" data-invoice="${escapeHtml(inv.id)}">PayPal</button>
        `
      });
    }
  }

  const allUpdates = projects
    .flatMap((p) => (p.updates || []).map((u) => ({ ...u, projectName: p.name, projectId: p.id })))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const attentionHtml = pendingActions.length
    ? `
      <div class="attention-panel">
        <div class="attention-header">
          <div class="attention-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>Action Required (${pendingActions.length})</span>
          </div>
        </div>
        <div class="attention-list">
          ${pendingActions
            .slice(0, 4)
            .map(
              (item) => `
            <div class="attention-row">
              <div class="attention-row-info">
                <strong>${escapeHtml(item.title)}</strong>
                <span class="attention-row-meta">${item.meta}</span>
              </div>
              <div class="attention-row-actions">${item.actions}</div>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    `
    : '';

  const projectsListHtml = projects.length
    ? projects
        .slice(0, 4)
        .map((project) => {
          const msCount = (project.milestones || []).length;
          const paidOrApprovedMs = (project.milestones || []).filter((m) =>
            ['paid', 'approved', 'completed'].includes(m.status)
          ).length;
          const pct = Math.min(100, Math.max(0, Number(project.progress) || 0));
          return `
            <div class="data-row">
              <div class="data-row-main">
                <div style="display:flex;align-items:center;gap:0.6rem;flex-wrap:wrap;">
                  <span class="data-row-title">${escapeHtml(project.name)}</span>
                  ${renderStatusTag(project.status)}
                </div>
                <div class="data-row-meta">
                  <span>${msCount ? `${paidOrApprovedMs}/${msCount} milestones cleared` : 'Workspace active'}</span>
                  <span aria-hidden="true">·</span>
                  <span>Due ${formatDate(project.dueDate)}</span>
                </div>
                <div style="display:flex;align-items:center;gap:0.75rem;margin-top:0.65rem;max-width:420px;">
                  <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
                  <span class="tabular-nums" style="font-size:0.8rem;font-weight:700;color:var(--portal-ink-secondary);">${pct}%</span>
                </div>
              </div>
              <div class="data-row-right">
                <button type="button" class="btn btn-secondary btn-sm" data-open-project="${escapeHtml(project.id)}">
                  Open Workspace →
                </button>
              </div>
            </div>
          `;
        })
        .join('')
    : `
      <div class="portal-empty-state">
        <div class="portal-empty-title">No Active Projects Yet</div>
        <p class="portal-empty-desc">${
          openProposals.length
            ? 'Your project workspace will appear automatically once you accept an open offer.'
            : 'Projects assigned to your company account will appear here.'
        }</p>
        ${
          openProposals.length
            ? `<button type="button" class="btn btn-primary btn-sm" data-jump-tab="offers">Review Open Offers</button>`
            : ''
        }
      </div>
    `;

  const updatesListHtml = allUpdates.length
    ? allUpdates
        .map(
          (item) => `
        <div class="data-row">
          <div class="data-row-main">
            <div class="data-row-title">${escapeHtml(item.title)}</div>
            <div class="data-row-meta">
              <span>${escapeHtml(item.projectName)}</span>
              <span aria-hidden="true">·</span>
              <time class="tabular-nums">${formatDate(item.createdAt)}</time>
            </div>
            <p style="margin-top:0.35rem;font-size:0.84rem;color:var(--portal-ink-secondary);">${escapeHtml(
              item.body.length > 140 ? item.body.slice(0, 140) + '…' : item.body
            )}</p>
          </div>
        </div>
      `
        )
        .join('')
    : `
      <div class="portal-empty-state">
        <div class="portal-empty-title">No Delivery Updates Yet</div>
        <p class="portal-empty-desc">Engineering sprint updates and release notes will appear here as work progresses.</p>
      </div>
    `;

  content.innerHTML = `
    <div class="view-header">
      <div>
        <h1 class="view-title">Welcome back, ${escapeHtml(profile.contactName)}</h1>
        <p class="view-subtitle">${escapeHtml(profile.companyName)} · Client Delivery Workspace</p>
      </div>
      <div class="view-actions">
        ${
          projects.length
            ? `<button type="button" class="btn btn-primary" data-jump-tab="projects">View Projects</button>`
            : `<button type="button" class="btn btn-primary" data-jump-tab="offers">View Offers</button>`
        }
        <button type="button" class="btn btn-secondary" data-jump-tab="billing">Billing &amp; Invoices</button>
      </div>
    </div>

    <div class="kpi-strip">
      <div class="kpi-cell">
        <span class="kpi-label">Active Projects</span>
        <strong class="kpi-value accent">${activeProjects.length}</strong>
        <span class="kpi-meta">${projects.length} total project${projects.length === 1 ? '' : 's'}</span>
      </div>
      <div class="kpi-cell">
        <span class="kpi-label">Open Offers</span>
        <strong class="kpi-value">${openProposals.length}</strong>
        <span class="kpi-meta">${proposals.length} proposal${proposals.length === 1 ? '' : 's'} on file</span>
      </div>
      <div class="kpi-cell">
        <span class="kpi-label">Average Progress</span>
        <strong class="kpi-value">${avgProgress}%</strong>
        <span class="kpi-meta">Across running projects</span>
      </div>
      <div class="kpi-cell">
        <span class="kpi-label">Balance Due</span>
        <strong class="kpi-value ${balanceDue > 0 ? 'warn' : ''}">${formatMoney(balanceDue, primaryCurrency)}</strong>
        <span class="kpi-meta">${maintenance.filter((m) => m.status === 'active').length} active care plan${
    maintenance.filter((m) => m.status === 'active').length === 1 ? '' : 's'
  }</span>
      </div>
    </div>

    ${attentionHtml}

    <div class="overview-grid">
      <div class="surface-card">
        <div class="surface-header">
          <div>
            <h2 class="surface-title">Project Workspaces</h2>
            <p class="surface-subtitle">Current delivery progress and milestone status</p>
          </div>
          ${
            projects.length
              ? `<button type="button" class="btn btn-ghost btn-sm" data-jump-tab="projects">All Projects →</button>`
              : ''
          }
        </div>
        <div class="data-list">${projectsListHtml}</div>
      </div>

      <div class="surface-card">
        <div class="surface-header">
          <div>
            <h2 class="surface-title">Recent Delivery Updates</h2>
            <p class="surface-subtitle">Latest notes from your engineering team</p>
          </div>
          ${
            allUpdates.length
              ? `<button type="button" class="btn btn-ghost btn-sm" data-jump-tab="updates">Full Timeline →</button>`
              : ''
          }
        </div>
        <div class="data-list">${updatesListHtml}</div>
      </div>
    </div>
  `;
}

function renderProjectsView() {
  const { projects, selectedProjectId, projectSubTab } = portalState;

  if (!projects.length) {
    content.innerHTML = `
      <div class="view-header">
        <div>
          <h1 class="view-title">Projects &amp; Milestones</h1>
          <p class="view-subtitle">Track active builds, review submitted deliverables, and manage milestone payments.</p>
        </div>
      </div>
      <div class="surface-card">
        <div class="portal-empty-state">
          <div class="portal-empty-title">No Projects Assigned Yet</div>
          <p class="portal-empty-desc">Once your proposal is accepted and engineering kickoff begins, your full project workspace will appear here.</p>
          <button type="button" class="btn btn-primary btn-sm" data-jump-tab="offers">Check Quotes &amp; Offers</button>
        </div>
      </div>
    `;
    return;
  }

  const activeProject = projects.find((p) => p.id === selectedProjectId) || projects[0];
  portalState.selectedProjectId = activeProject.id;

  const pct = Math.min(100, Math.max(0, Number(activeProject.progress) || 0));
  const milestones = activeProject.milestones || [];
  const invoices = activeProject.invoices || [];
  const updates = activeProject.updates || [];
  const files = activeProject.files || [];

  const projectSwitcher =
    projects.length > 1
      ? `
      <div class="segmented-bar" role="tablist" aria-label="Select project">
        ${projects
          .map(
            (p) => `
          <button type="button" class="segmented-btn ${p.id === activeProject.id ? 'active' : ''}" data-select-project="${escapeHtml(p.id)}">
            ${escapeHtml(p.name)}
          </button>
        `
          )
          .join('')}
      </div>
    `
      : '';

  let subContent = '';
  if (projectSubTab === 'milestones') {
    subContent = milestones.length
      ? `
      <div class="table-wrap">
        <table class="portal-table">
          <thead>
            <tr>
              <th>Milestone</th>
              <th>Due Date</th>
              <th>Status</th>
              <th class="text-right">Amount</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${milestones
              .map(
                (ms) => `
              <tr>
                <td>
                  <strong style="color:var(--portal-ink);display:block;">${escapeHtml(ms.title)}</strong>
                  ${ms.description ? `<span style="font-size:0.8rem;color:var(--portal-ink-muted);">${escapeHtml(ms.description)}</span>` : ''}
                </td>
                <td class="tabular-nums">${formatDate(ms.dueDate)}</td>
                <td>${renderStatusTag(ms.status)}</td>
                <td class="text-right amount-display">${formatMoney(ms.amount, ms.currency)}</td>
                <td class="text-right">
                  <div style="display:inline-flex;gap:0.4rem;flex-wrap:wrap;justify-content:flex-end;">
                    ${
                      ms.status === 'submitted'
                        ? `<button class="btn btn-primary btn-sm milestone-decision" data-project="${escapeHtml(activeProject.id)}" data-milestone="${escapeHtml(ms.id)}" data-status="approved">Approve</button>
                           <button class="btn btn-secondary btn-sm milestone-decision" data-project="${escapeHtml(activeProject.id)}" data-milestone="${escapeHtml(ms.id)}" data-status="revision_requested">Request Revision</button>`
                        : ''
                    }
                    ${
                      Number(ms.amount) > 0 && ms.status !== 'paid'
                        ? `<button class="btn btn-secondary btn-sm portal-pay" data-project="${escapeHtml(activeProject.id)}" data-milestone="${escapeHtml(ms.id)}" data-provider="stripe">Stripe</button>
                           <button class="btn btn-secondary btn-sm portal-pay" data-project="${escapeHtml(activeProject.id)}" data-milestone="${escapeHtml(ms.id)}" data-provider="paypal">PayPal</button>`
                        : ms.status === 'paid'
                        ? renderPaidReceiptControls('milestone', ms.id, ms.paidAt, ms.paymentProvider)
                        : ''
                    }
                  </div>
                </td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </div>
    `
      : `<div class="portal-empty-state"><div class="portal-empty-title">No Milestones Configured</div><p class="portal-empty-desc">Deliverable milestones will appear here once scheduled by your project lead.</p></div>`;
  } else if (projectSubTab === 'invoices') {
    subContent = invoices.length
      ? `
      <div class="table-wrap">
        <table class="portal-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Description</th>
              <th>Due Date</th>
              <th>Status</th>
              <th class="text-right">Amount</th>
              <th class="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            ${invoices
              .map(
                (inv) => `
              <tr>
                <td class="tabular-nums" style="font-weight:600;color:var(--portal-ink);">${escapeHtml(inv.invoiceNumber)}</td>
                <td>${escapeHtml(inv.description)}</td>
                <td class="tabular-nums">${formatDate(inv.dueDate)}</td>
                <td>${renderStatusTag(inv.status)}</td>
                <td class="text-right amount-display">${formatMoney(inv.amount, inv.currency)}</td>
                <td class="text-right">
                  ${
                    inv.status === 'paid'
                      ? renderPaidReceiptControls('invoice', inv.id, inv.paidAt, null)
                      : `<span style="font-size:0.78rem;color:var(--portal-ink-muted);">—</span>`
                  }
                </td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </div>
    `
      : `<div class="portal-empty-state"><div class="portal-empty-title">No Project Invoices</div><p class="portal-empty-desc">Invoices linked to this project will appear here when issued.</p></div>`;
  } else if (projectSubTab === 'updates') {
    subContent = updates.length
      ? `<div class="data-list">
          ${updates
            .map(
              (u) => `
            <div class="data-row">
              <div class="data-row-main">
                <div class="data-row-title">${escapeHtml(u.title)}</div>
                <div class="data-row-meta">
                  <time class="tabular-nums">${formatDate(u.createdAt)}</time>
                  ${u.progress != null ? `<span aria-hidden="true">·</span><span class="tabular-nums">Progress ${Number(u.progress)}%</span>` : ''}
                </div>
                <p style="margin-top:0.45rem;color:var(--portal-ink-secondary);font-size:0.88rem;white-space:pre-line;">${escapeHtml(u.body)}</p>
              </div>
            </div>
          `
            )
            .join('')}
        </div>`
      : `<div class="portal-empty-state"><div class="portal-empty-title">No Updates Posted</div><p class="portal-empty-desc">Sprint progress reports and deployment notices for this project will appear here.</p></div>`;
  } else if (projectSubTab === 'files') {
    subContent = files.length
      ? `<div class="data-list">
          ${files
            .map(
              (f) => `
            <div class="data-row">
              <div class="data-row-main">
                <div class="data-row-title">${escapeHtml(f.originalName)}</div>
                <div class="data-row-meta">
                  <span>${escapeHtml(getFileExtension(f.originalName))}</span>
                  <span aria-hidden="true">·</span>
                  <span class="tabular-nums">${Math.max(1, Math.ceil(Number(f.fileSize || 0) / 1024))} KB</span>
                  <span aria-hidden="true">·</span>
                  <time class="tabular-nums">${formatDate(f.createdAt)}</time>
                </div>
              </div>
              <div class="data-row-right">
                <a class="btn btn-secondary btn-sm" href="/api/projects/${encodeURIComponent(activeProject.id)}/files/${encodeURIComponent(f.id)}/download" data-download-file>Download</a>
              </div>
            </div>
          `
            )
            .join('')}
        </div>`
      : `<div class="portal-empty-state"><div class="portal-empty-title">No Shared Files</div><p class="portal-empty-desc">Architecture diagrams, specifications, and release bundles shared by your team will appear here.</p></div>`;
  }

  content.innerHTML = `
    <div class="view-header">
      <div>
        <h1 class="view-title">Projects &amp; Milestones</h1>
        <p class="view-subtitle">Detailed delivery progress, milestone approvals, and project files.</p>
      </div>
      <div class="view-actions">${projectSwitcher}</div>
    </div>

    <div class="surface-card">
      <div class="project-hero-panel">
        <div class="project-hero-top">
          <div>
            <div style="display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;">
              <h2 class="project-hero-title">${escapeHtml(activeProject.name)}</h2>
              ${renderStatusTag(activeProject.status)}
            </div>
            <div class="data-row-meta" style="margin-top:0.35rem;">
              <span>${escapeHtml(activeProject.companyName || portalState.profile.companyName)}</span>
              <span aria-hidden="true">·</span>
              <span>Start ${formatDate(activeProject.startDate)}</span>
              <span aria-hidden="true">·</span>
              <span>Target Due ${formatDate(activeProject.dueDate)}</span>
            </div>
            <p class="project-hero-desc">${escapeHtml(activeProject.description || 'Active RSTechwerk delivery workspace.')}</p>
          </div>
        </div>
        <div class="project-progress-block">
          <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
          <span class="project-progress-label">${pct}% complete</span>
        </div>
      </div>

      <div class="project-subtabs" role="tablist">
        <button type="button" class="subtab-btn ${projectSubTab === 'milestones' ? 'active' : ''}" data-project-subtab="milestones">
          Milestones <span class="tabular-nums">(${milestones.length})</span>
        </button>
        <button type="button" class="subtab-btn ${projectSubTab === 'invoices' ? 'active' : ''}" data-project-subtab="invoices">
          Invoices <span class="tabular-nums">(${invoices.length})</span>
        </button>
        <button type="button" class="subtab-btn ${projectSubTab === 'updates' ? 'active' : ''}" data-project-subtab="updates">
          Delivery Updates <span class="tabular-nums">(${updates.length})</span>
        </button>
        <button type="button" class="subtab-btn ${projectSubTab === 'files' ? 'active' : ''}" data-project-subtab="files">
          Shared Documents <span class="tabular-nums">(${files.length})</span>
        </button>
      </div>

      ${subContent}
    </div>
  `;
}

function renderOffersView() {
  const { proposals, offerFilter } = portalState;
  const filtered = proposals.filter((p) => {
    if (offerFilter === 'open') return ['draft', 'sent'].includes(p.status);
    if (offerFilter === 'accepted') return p.status === 'accepted';
    if (offerFilter === 'closed') return ['rejected', 'expired'].includes(p.status);
    return true;
  });

  const rowsHtml = filtered.length
    ? filtered
        .map(
          (proposal) => `
      <div class="data-row" style="align-items:flex-start;">
        <div class="data-row-main">
          <div style="display:flex;align-items:center;gap:0.65rem;flex-wrap:wrap;">
            <span class="data-row-title">${escapeHtml(proposal.title)}</span>
            ${renderStatusTag(proposal.status)}
          </div>
          <div class="data-row-meta">
            <span>Created ${formatDate(proposal.createdAt)}</span>
            ${proposal.expiresAt ? `<span aria-hidden="true">·</span><span>Valid until ${formatDate(proposal.expiresAt)}</span>` : ''}
            ${proposal.acceptedAt ? `<span aria-hidden="true">·</span><span>Accepted ${formatDate(proposal.acceptedAt)}</span>` : ''}
          </div>
          <p style="margin-top:0.55rem;color:var(--portal-ink-secondary);font-size:0.88rem;white-space:pre-line;">${escapeHtml(proposal.scope)}</p>
          ${
            proposal.terms
              ? `<p style="margin-top:0.4rem;font-size:0.82rem;color:var(--portal-ink-muted);">Terms: ${escapeHtml(proposal.terms)}</p>`
              : ''
          }
        </div>
        <div class="data-row-right" style="flex-direction:column;align-items:flex-end;gap:0.6rem;">
          <span class="amount-display" style="font-size:1.08rem;">${formatMoney(proposal.totalAmount, proposal.currency)}</span>
          ${
            proposal.status === 'draft' || proposal.status === 'sent'
              ? `<div style="display:flex;gap:0.45rem;flex-wrap:wrap;">
                  <button class="btn btn-primary btn-sm proposal-decision" data-id="${escapeHtml(proposal.id)}" data-status="accepted">Accept Offer</button>
                  <button class="btn btn-secondary btn-sm proposal-decision" data-id="${escapeHtml(proposal.id)}" data-status="rejected">Decline</button>
                 </div>`
              : ''
          }
        </div>
      </div>
    `
        )
        .join('')
    : `
      <div class="portal-empty-state">
        <div class="portal-empty-title">No Offers in This View</div>
        <p class="portal-empty-desc">Custom engineering proposals and project scopes prepared for your organization will appear here.</p>
      </div>
    `;

  content.innerHTML = `
    <div class="view-header">
      <div>
        <h1 class="view-title">Quotes &amp; Offers</h1>
        <p class="view-subtitle">Review project proposals, commercial scope, and authorize engagement kickoff.</p>
      </div>
      <div class="segmented-bar" role="tablist" aria-label="Filter offers">
        <button type="button" class="segmented-btn ${offerFilter === 'all' ? 'active' : ''}" data-offer-filter="all">All (${proposals.length})</button>
        <button type="button" class="segmented-btn ${offerFilter === 'open' ? 'active' : ''}" data-offer-filter="open">Open</button>
        <button type="button" class="segmented-btn ${offerFilter === 'accepted' ? 'active' : ''}" data-offer-filter="accepted">Accepted</button>
        <button type="button" class="segmented-btn ${offerFilter === 'closed' ? 'active' : ''}" data-offer-filter="closed">Closed</button>
      </div>
    </div>

    <div class="surface-card">
      <div class="data-list">${rowsHtml}</div>
    </div>
  `;
}

function renderMaintenanceView() {
  const { maintenance, maintenanceInvoices } = portalState;
  const activePlans = maintenance.filter((m) => m.status === 'active');
  const monthlyRecurring = activePlans
    .filter((m) => m.billingType === 'monthly')
    .reduce((sum, m) => sum + Number(m.amount || 0), 0);
  const currency = maintenance[0]?.currency || maintenanceInvoices[0]?.currency || 'EUR';
  const unpaidCount = maintenanceInvoices.filter((i) => i.status !== 'paid').length;

  const contractsHtml = maintenance.length
    ? `
    <div class="table-wrap">
      <table class="portal-table">
        <thead>
          <tr>
            <th>Plan / Service</th>
            <th>Linked Project</th>
            <th>Cadence</th>
            <th>Next Billing</th>
            <th>Status</th>
            <th class="text-right">Rate</th>
          </tr>
        </thead>
        <tbody>
          ${maintenance
            .map(
              (item) => `
            <tr>
              <td>
                <strong style="color:var(--portal-ink);display:block;">${escapeHtml(item.title)}</strong>
                <span style="font-size:0.8rem;color:var(--portal-ink-muted);">${escapeHtml(
                  item.description || 'Ongoing software maintenance and SLA coverage'
                )}</span>
              </td>
              <td>${escapeHtml(item.projectName || 'Account-wide')}</td>
              <td>${escapeHtml(formatStatusLabel(item.billingType))}</td>
              <td class="tabular-nums">${formatDate(item.nextBillingDate)}</td>
              <td>${renderStatusTag(item.status)}</td>
              <td class="text-right amount-display">${formatMoney(item.amount, item.currency)}</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    </div>
  `
    : `<div class="portal-empty-state"><div class="portal-empty-title">No Maintenance Contracts</div><p class="portal-empty-desc">Active retainer agreements and post-launch SLA coverage will appear here.</p></div>`;

  const invoicesHtml = maintenanceInvoices.length
    ? `
    <div class="table-wrap">
      <table class="portal-table">
        <thead>
          <tr>
            <th>Invoice #</th>
            <th>Contract</th>
            <th>Due Date</th>
            <th>Status</th>
            <th class="text-right">Amount</th>
            <th class="text-right">Payment</th>
          </tr>
        </thead>
        <tbody>
          ${maintenanceInvoices
            .map(
              (inv) => `
            <tr>
              <td class="tabular-nums" style="font-weight:600;color:var(--portal-ink);">${escapeHtml(inv.invoiceNumber)}</td>
              <td>${escapeHtml(inv.title)}</td>
              <td class="tabular-nums">${formatDate(inv.dueDate)}</td>
              <td>${renderStatusTag(inv.status)}</td>
              <td class="text-right amount-display">${formatMoney(inv.amount, inv.currency)}</td>
              <td class="text-right">
                ${
                  inv.status !== 'paid'
                    ? `<div style="display:inline-flex;gap:0.4rem;">
                        <button class="btn btn-primary btn-sm maintenance-pay" data-provider="stripe" data-invoice="${escapeHtml(inv.id)}">Stripe</button>
                        <button class="btn btn-secondary btn-sm maintenance-pay" data-provider="paypal" data-invoice="${escapeHtml(inv.id)}">PayPal</button>
                       </div>`
                    : renderPaidReceiptControls('maintenance', inv.id, inv.paidAt, inv.paymentProvider)
                }
              </td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    </div>
  `
    : `<div class="portal-empty-state"><div class="portal-empty-title">No Maintenance Invoices</div><p class="portal-empty-desc">Recurring and on-demand retainer invoices will appear here once billed.</p></div>`;

  content.innerHTML = `
    <div class="view-header">
      <div>
        <h1 class="view-title">Maintenance &amp; Retainers</h1>
        <p class="view-subtitle">Monitor active SLA plans, recurring engineering retainers, and maintenance billing.</p>
      </div>
    </div>

    <div class="kpi-strip kpi-strip-3">
      <div class="kpi-cell">
        <span class="kpi-label">Active Care Plans</span>
        <strong class="kpi-value accent">${activePlans.length}</strong>
        <span class="kpi-meta">${maintenance.length} total contract${maintenance.length === 1 ? '' : 's'}</span>
      </div>
      <div class="kpi-cell">
        <span class="kpi-label">Monthly Retainer Rate</span>
        <strong class="kpi-value">${formatMoney(monthlyRecurring, currency)}</strong>
        <span class="kpi-meta">Active monthly commitments</span>
      </div>
      <div class="kpi-cell">
        <span class="kpi-label">Open Maintenance Invoices</span>
        <strong class="kpi-value ${unpaidCount > 0 ? 'warn' : ''}">${unpaidCount}</strong>
        <span class="kpi-meta">${maintenanceInvoices.length} total invoice${maintenanceInvoices.length === 1 ? '' : 's'}</span>
      </div>
    </div>

    <div class="stack-gap">
      <div class="surface-card">
        <div class="surface-header">
          <div>
            <h2 class="surface-title">Active Maintenance Contracts</h2>
            <p class="surface-subtitle">Ongoing engineering support, security patching, and infrastructure care</p>
          </div>
        </div>
        ${contractsHtml}
      </div>

      <div class="surface-card">
        <div class="surface-header">
          <div>
            <h2 class="surface-title">Maintenance Invoices</h2>
            <p class="surface-subtitle">Recurring and one-time maintenance charges</p>
          </div>
        </div>
        ${invoicesHtml}
      </div>
    </div>
  `;
}

function renderBillingView() {
  const { projects, maintenanceInvoices, billingFilter } = portalState;

  const entries = [];
  for (const project of projects) {
    for (const ms of project.milestones || []) {
      if (Number(ms.amount) > 0 || ms.status === 'paid') {
        entries.push({
          receiptType: 'milestone',
          receiptId: ms.id,
          paymentProvider: ms.paymentProvider || null,
          ref: 'Milestone',
          title: ms.title,
          context: project.name,
          dueDate: ms.dueDate,
          paidAt: ms.paidAt,
          status: ms.status === 'paid' ? 'paid' : ms.status,
          isPaid: ms.status === 'paid',
          amount: Number(ms.amount),
          currency: ms.currency || 'EUR',
          payButtons:
            ms.status !== 'paid'
              ? `<button class="btn btn-primary btn-sm portal-pay" data-project="${escapeHtml(project.id)}" data-milestone="${escapeHtml(ms.id)}" data-provider="stripe">Stripe</button>
                 <button class="btn btn-secondary btn-sm portal-pay" data-project="${escapeHtml(project.id)}" data-milestone="${escapeHtml(ms.id)}" data-provider="paypal">PayPal</button>`
              : null
        });
      }
    }
    for (const inv of project.invoices || []) {
      entries.push({
        receiptType: 'invoice',
        receiptId: inv.id,
        paymentProvider: null,
        ref: inv.invoiceNumber,
        title: inv.description,
        context: project.name,
        dueDate: inv.dueDate,
        paidAt: inv.paidAt,
        status: inv.status,
        isPaid: inv.status === 'paid',
        amount: Number(inv.amount),
        currency: inv.currency || 'EUR',
        payButtons: null
      });
    }
  }

  for (const inv of maintenanceInvoices) {
    entries.push({
      receiptType: 'maintenance',
      receiptId: inv.id,
      paymentProvider: inv.paymentProvider || null,
      ref: inv.invoiceNumber,
      title: inv.title,
      context: inv.projectName ? `${inv.projectName} · Maintenance` : 'Maintenance Retainer',
      dueDate: inv.dueDate,
      paidAt: inv.paidAt,
      status: inv.status,
      isPaid: inv.status === 'paid',
      amount: Number(inv.amount),
      currency: inv.currency || 'EUR',
      payButtons:
        inv.status !== 'paid'
          ? `<button class="btn btn-primary btn-sm maintenance-pay" data-provider="stripe" data-invoice="${escapeHtml(inv.id)}">Stripe</button>
             <button class="btn btn-secondary btn-sm maintenance-pay" data-provider="paypal" data-invoice="${escapeHtml(inv.id)}">PayPal</button>`
          : null
    });
  }

  const paidEntries = entries.filter((e) => e.isPaid);
  const unpaidEntries = entries.filter((e) => !e.isPaid && e.status !== 'cancelled');

  const sumByCurrency = (list) => {
    const totals = new Map();
    for (const item of list) {
      const code = String(item.currency || 'EUR').toUpperCase();
      totals.set(code, (totals.get(code) || 0) + Number(item.amount || 0));
    }
    if (!totals.size) return formatMoney(0, entries[0]?.currency || 'EUR');
    return [...totals.entries()].map(([cur, val]) => formatMoney(val, cur)).join(' + ');
  };

  const filtered = entries.filter((e) => {
    if (billingFilter === 'unpaid') return !e.isPaid && e.status !== 'cancelled';
    if (billingFilter === 'paid') return e.isPaid;
    return true;
  });

  const ledgerHtml = filtered.length
    ? `
    <div class="table-wrap">
      <table class="portal-table">
        <thead>
          <tr>
            <th>Reference</th>
            <th>Item &amp; Project</th>
            <th>Due Date</th>
            <th>Status</th>
            <th class="text-right">Amount</th>
            <th class="text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          ${filtered
            .map(
              (item) => `
            <tr>
              <td class="tabular-nums" style="font-weight:600;color:var(--portal-ink);">${escapeHtml(item.ref)}</td>
              <td>
                <strong style="color:var(--portal-ink);display:block;">${escapeHtml(item.title)}</strong>
                <span style="font-size:0.8rem;color:var(--portal-ink-muted);">${escapeHtml(item.context)}</span>
              </td>
              <td class="tabular-nums">${formatDate(item.dueDate)}</td>
              <td>${renderStatusTag(item.status)}</td>
              <td class="text-right amount-display">${formatMoney(item.amount, item.currency)}</td>
              <td class="text-right">
                ${
                  item.payButtons
                    ? `<div style="display:inline-flex;gap:0.4rem;">${item.payButtons}</div>`
                    : item.isPaid
                    ? renderPaidReceiptControls(item.receiptType, item.receiptId, item.paidAt, item.paymentProvider)
                    : `<span style="font-size:0.78rem;color:var(--portal-ink-muted);">—</span>`
                }
              </td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    </div>
  `
    : `<div class="portal-empty-state"><div class="portal-empty-title">No Billing Records Found</div><p class="portal-empty-desc">Project milestone charges, invoices, and maintenance bills will appear here.</p></div>`;

  content.innerHTML = `
    <div class="view-header">
      <div>
        <h1 class="view-title">Billing &amp; Invoices</h1>
        <p class="view-subtitle">Consolidated ledger of project milestones, invoices, and maintenance payments.</p>
      </div>
      <div class="segmented-bar" role="tablist" aria-label="Filter billing ledger">
        <button type="button" class="segmented-btn ${billingFilter === 'all' ? 'active' : ''}" data-billing-filter="all">All (${entries.length})</button>
        <button type="button" class="segmented-btn ${billingFilter === 'unpaid' ? 'active' : ''}" data-billing-filter="unpaid">Unpaid (${unpaidEntries.length})</button>
        <button type="button" class="segmented-btn ${billingFilter === 'paid' ? 'active' : ''}" data-billing-filter="paid">Paid (${paidEntries.length})</button>
      </div>
    </div>

    <div class="kpi-strip kpi-strip-3">
      <div class="kpi-cell">
        <span class="kpi-label">Paid Receipts</span>
        <strong class="kpi-value accent">${paidEntries.length}</strong>
        <span class="kpi-meta">${entries.length} total billing record${entries.length === 1 ? '' : 's'}</span>
      </div>
      <div class="kpi-cell">
        <span class="kpi-label">Total Settled</span>
        <strong class="kpi-value">${sumByCurrency(paidEntries)}</strong>
        <span class="kpi-meta">Verified payment proofs available</span>
      </div>
      <div class="kpi-cell">
        <span class="kpi-label">Balance Due</span>
        <strong class="kpi-value ${unpaidEntries.length ? 'warn' : ''}">${sumByCurrency(unpaidEntries)}</strong>
        <span class="kpi-meta">${unpaidEntries.length} open item${unpaidEntries.length === 1 ? '' : 's'}</span>
      </div>
    </div>

    <div class="surface-card">${ledgerHtml}</div>
  `;
}

function renderUpdatesView() {
  const { projects, updateProjectFilter } = portalState;
  const allUpdates = projects
    .flatMap((p) => (p.updates || []).map((u) => ({ ...u, projectName: p.name, projectId: p.id })))
    .filter((u) => updateProjectFilter === 'all' || u.projectId === updateProjectFilter)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const projectFilterButtons =
    projects.length > 1
      ? `
      <div class="segmented-bar" role="tablist">
        <button type="button" class="segmented-btn ${updateProjectFilter === 'all' ? 'active' : ''}" data-update-filter="all">All Projects</button>
        ${projects
          .map(
            (p) =>
              `<button type="button" class="segmented-btn ${updateProjectFilter === p.id ? 'active' : ''}" data-update-filter="${escapeHtml(p.id)}">${escapeHtml(p.name)}</button>`
          )
          .join('')}
      </div>
    `
      : '';

  const listHtml = allUpdates.length
    ? `<div class="data-list">
        ${allUpdates
          .map(
            (u) => `
          <div class="data-row" style="align-items:flex-start;">
            <div class="data-row-main">
              <div style="display:flex;align-items:center;gap:0.6rem;flex-wrap:wrap;">
                <span class="data-row-title">${escapeHtml(u.title)}</span>
                ${u.progress != null ? `<span class="status-tag info tabular-nums">${Number(u.progress)}% Progress</span>` : ''}
              </div>
              <div class="data-row-meta">
                <span>${escapeHtml(u.projectName)}</span>
                <span aria-hidden="true">·</span>
                <time class="tabular-nums">${formatDate(u.createdAt)}</time>
              </div>
              <p style="margin-top:0.55rem;color:var(--portal-ink-secondary);font-size:0.9rem;white-space:pre-line;">${escapeHtml(u.body)}</p>
            </div>
          </div>
        `
          )
          .join('')}
      </div>`
    : `<div class="portal-empty-state"><div class="portal-empty-title">No Delivery Updates Yet</div><p class="portal-empty-desc">Weekly sprint summaries and engineering release notes will appear here.</p></div>`;

  content.innerHTML = `
    <div class="view-header">
      <div>
        <h1 class="view-title">Delivery Updates</h1>
        <p class="view-subtitle">Chronological sprint progress and engineering notes across your projects.</p>
      </div>
      ${projectFilterButtons}
    </div>
    <div class="surface-card">${listHtml}</div>
  `;
}

function renderDocumentsView() {
  const { projects, documentQuery } = portalState;
  const query = documentQuery.trim().toLowerCase();

  const allFiles = projects
    .flatMap((p) => (p.files || []).map((f) => ({ ...f, projectName: p.name, projectId: p.id })))
    .filter(
      (f) =>
        !query ||
        f.originalName.toLowerCase().includes(query) ||
        f.projectName.toLowerCase().includes(query)
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const filesHtml = allFiles.length
    ? `
    <div class="table-wrap">
      <table class="portal-table">
        <thead>
          <tr>
            <th>Document Name</th>
            <th>Project</th>
            <th>Type</th>
            <th>Size</th>
            <th>Shared On</th>
            <th class="text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          ${allFiles
            .map(
              (f) => `
            <tr>
              <td style="font-weight:600;color:var(--portal-ink);">${escapeHtml(f.originalName)}</td>
              <td>${escapeHtml(f.projectName)}</td>
              <td><span class="status-tag">${escapeHtml(getFileExtension(f.originalName))}</span></td>
              <td class="tabular-nums">${Math.max(1, Math.ceil(Number(f.fileSize || 0) / 1024))} KB</td>
              <td class="tabular-nums">${formatDate(f.createdAt)}</td>
              <td class="text-right">
                <a class="btn btn-secondary btn-sm" href="/api/projects/${encodeURIComponent(f.projectId)}/files/${encodeURIComponent(f.id)}/download" data-download-file>Download</a>
              </td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
    </div>
  `
    : `<div class="portal-empty-state"><div class="portal-empty-title">${query ? 'No Matching Documents' : 'No Shared Documents Yet'}</div><p class="portal-empty-desc">${
        query
          ? 'Try clearing your search filter to inspect all project files.'
          : 'Contracts, technical specifications, and delivery packages shared with you will appear here.'
      }</p></div>`;

  content.innerHTML = `
    <div class="view-header">
      <div>
        <h1 class="view-title">Shared Documents</h1>
        <p class="view-subtitle">Secure access to specifications, technical deliverables, and project documentation.</p>
      </div>
      <div class="portal-search-wrap">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="search"
          id="portalDocSearch"
          class="portal-search-input"
          placeholder="Search files or projects…"
          value="${escapeHtml(documentQuery)}"
        />
      </div>
    </div>

    <div class="surface-card">${filesHtml}</div>
  `;

  const searchInput = document.getElementById('portalDocSearch');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      portalState.documentQuery = e.target.value;
      renderDocumentsView();
      const restored = document.getElementById('portalDocSearch');
      if (restored) {
        restored.focus();
        restored.setSelectionRange(restored.value.length, restored.value.length);
      }
    });
  }
}

function renderProfileView() {
  const { profile } = portalState;

  content.innerHTML = `
    <div class="view-header">
      <div>
        <h1 class="view-title">Profile &amp; Security</h1>
        <p class="view-subtitle">Manage your organization details, contact preferences, and account password.</p>
      </div>
    </div>

    <div class="profile-grid">
      <div class="surface-card">
        <div class="surface-header">
          <div>
            <h2 class="surface-title">Company &amp; Contact Details</h2>
            <p class="surface-subtitle">Used on invoices, proposals, and delivery notifications</p>
          </div>
          ${renderStatusTag(profile.status || 'active')}
        </div>

        <form id="profileForm" class="portal-form-grid">
          <label class="field-label">
            Company name
            <input class="field-input" name="companyName" required value="${escapeHtml(profile.companyName || '')}" />
          </label>
          <label class="field-label">
            Primary contact
            <input class="field-input" name="contactName" required value="${escapeHtml(profile.contactName || '')}" />
          </label>
          <label class="field-label">
            Account email
            <input class="field-input" disabled value="${escapeHtml(profile.email || '')}" />
          </label>
          <label class="field-label">
            Phone number
            <input class="field-input" name="phone" value="${escapeHtml(profile.phone || '')}" placeholder="+49 30 000000" />
          </label>
          <label class="field-label">
            Country
            <input class="field-input" name="country" value="${escapeHtml(profile.country || '')}" placeholder="Germany" />
          </label>
          <label class="field-label">
            Preferred language
            <select class="field-select" name="preferredLanguage">
              <option value="en" ${profile.preferredLanguage === 'en' ? 'selected' : ''}>English</option>
              <option value="de" ${profile.preferredLanguage === 'de' ? 'selected' : ''}>Deutsch</option>
              <option value="es" ${profile.preferredLanguage === 'es' ? 'selected' : ''}>Español</option>
            </select>
          </label>
          <label class="field-label">
            Company website
            <input class="field-input" name="website" type="url" value="${escapeHtml(profile.website || '')}" placeholder="https://company.com" />
          </label>
          <label class="field-label">
            Timezone
            <input class="field-input" name="timezone" value="${escapeHtml(profile.timezone || '')}" placeholder="Europe/Berlin" />
          </label>
          <label class="field-label field-full">
            Street address
            <input class="field-input" name="address" value="${escapeHtml(profile.address || '')}" />
          </label>
          <label class="field-label field-full">
            City &amp; postal code
            <input class="field-input" name="city" value="${escapeHtml(profile.city || '')}" placeholder="Berlin, 10115" />
          </label>

          <div class="field-full form-footer-row">
            <button class="btn btn-primary" type="submit">Save Profile Changes</button>
            <span id="profileMessage" class="form-feedback"></span>
          </div>
        </form>
      </div>

      <div class="surface-card">
        <div class="surface-header">
          <div>
            <h2 class="surface-title">Account Security</h2>
            <p class="surface-subtitle">Minimum 10 characters required</p>
          </div>
        </div>

        <form id="passwordForm" class="portal-form-stack">
          <label class="field-label">
            Current password
            <input class="field-input" name="currentPassword" type="password" required autocomplete="current-password" />
          </label>
          <label class="field-label">
            New password
            <input class="field-input" name="newPassword" type="password" minlength="10" required autocomplete="new-password" />
          </label>

          <div class="form-footer-row">
            <button class="btn btn-secondary" type="submit">Update Password</button>
            <span id="passwordMessage" class="form-feedback"></span>
          </div>
        </form>
      </div>
    </div>
  `;

  bindProfileForms();
}

function bindProfileForms() {
  document.getElementById('profileForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const message = document.getElementById('profileMessage');
    if (message) {
      message.className = 'form-feedback';
      message.textContent = 'Saving…';
    }
    try {
      await portalFetch('/api/client/profile', { method: 'PATCH', body: JSON.stringify(data) });
      portalState.profile = { ...portalState.profile, ...data };
      updateSidebarChrome();
      if (message) {
        message.className = 'form-feedback success';
        message.textContent = 'Profile saved successfully.';
      }
    } catch (error) {
      if (message) {
        message.className = 'form-feedback error';
        message.textContent = error.message;
      }
    }
  });

  document.getElementById('passwordForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const message = document.getElementById('passwordMessage');
    if (message) {
      message.className = 'form-feedback';
      message.textContent = 'Updating…';
    }
    try {
      await portalFetch('/api/client/password', { method: 'POST', body: JSON.stringify(data) });
      form.reset();
      if (message) {
        message.className = 'form-feedback success';
        message.textContent = 'Password updated. Use it on your next sign-in.';
      }
    } catch (error) {
      if (message) {
        message.className = 'form-feedback error';
        message.textContent = error.message;
      }
    }
  });
}

/* Error / Auth Prompt States
   ========================================================================== */
function renderPortalErrorState(error) {
  const isAuthError = error?.code === 401 || !session?.token;
  const isStaffAccount = error?.code === 404 && ['Administrator', 'admin', 'manager'].includes(session?.role);

  content.innerHTML = `
    <div class="surface-card" style="max-width:540px;margin:3rem auto;">
      <div class="portal-empty-state">
        <div class="portal-empty-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
        <h1 class="portal-empty-title">
          ${
            isAuthError
              ? 'Client Sign-In Required'
              : isStaffAccount
              ? 'Staff Account Detected'
              : 'Unable to Load Workspace'
          }
        </h1>
        <p class="portal-empty-desc">
          ${
            isStaffAccount
              ? 'You are signed in with an administrator account that does not have an associated client profile. Open the Admin Console or sign in with a client account.'
              : escapeHtml(error?.message || 'Unable to load portal data.')
          }
        </p>
        <div style="display:flex;gap:0.65rem;flex-wrap:wrap;margin-top:0.5rem;">
          ${
            isStaffAccount
              ? `<a href="/admin.html" class="btn btn-primary">Open Admin Console</a>
                 <a href="/login.html?redirect=portal" class="btn btn-secondary">Switch Account</a>`
              : `<a href="/login.html?redirect=portal" class="btn btn-primary">Sign In to Portal</a>
                 <a href="/register.html" class="btn btn-secondary">Create Client Account</a>`
          }
        </div>
      </div>
    </div>
  `;
}

/* Data Loading
   ========================================================================== */
async function loadPortal() {
  try {
    await handlePaymentReturnParams();
    await loadPortalTranslations();

    const [profileResult, projectsResult, proposalResult, maintenanceResult, maintenanceInvoiceResult] =
      await Promise.all([
        portalFetch('/api/client/profile'),
        portalFetch('/api/projects'),
        portalFetch('/api/proposals'),
        portalFetch('/api/maintenance'),
        portalFetch('/api/maintenance/invoices')
      ]);

    const rawProjects = projectsResult.projects || [];
    const enrichedProjects = await Promise.all(
      rawProjects.map(async (project) => {
        const [milestones, updates, files, invoices] = await Promise.all([
          portalFetch(`/api/projects/${encodeURIComponent(project.id)}/milestones`),
          portalFetch(`/api/projects/${encodeURIComponent(project.id)}/updates`),
          portalFetch(`/api/projects/${encodeURIComponent(project.id)}/files`),
          portalFetch(`/api/projects/${encodeURIComponent(project.id)}/invoices`)
        ]);
        return {
          ...project,
          milestones: milestones.milestones || [],
          updates: updates.updates || [],
          files: files.files || [],
          invoices: invoices.invoices || []
        };
      })
    );

    portalState.profile = profileResult.profile;
    portalState.projects = enrichedProjects;
    portalState.proposals = proposalResult.proposals || [];
    portalState.maintenance = maintenanceResult.maintenance || [];
    portalState.maintenanceInvoices = maintenanceInvoiceResult.invoices || [];

    if (!portalState.selectedProjectId && enrichedProjects.length) {
      portalState.selectedProjectId = enrichedProjects[0].id;
    }

    updateSidebarChrome();
    switchTab(resolveInitialTabFromHash());
  } catch (error) {
    renderPortalErrorState(error);
  }
}

async function loadPortalTranslations() {
  try {
    const response = await fetch('/api/content');
    if (!response.ok) return;
    const result = await response.json();
    const shared = result.content?.i18n;
    if (!shared || typeof shared !== 'object') return;
    for (const language of ['de', 'es']) {
      if (shared[language] && typeof shared[language] === 'object') Object.assign(PORTAL_LANGUAGE_COPY[language], shared[language]);
    }
    applyPortalLanguage(localStorage.getItem('tecklumo-language') || 'en');
  } catch (error) {
    console.info('Using built-in client portal translations.', error.message);
  }
}

/* Global Event Delegation
   ========================================================================== */
document.getElementById('portalLogout')?.addEventListener('click', () => {
  localStorage.removeItem(PORTAL_SESSION_KEY);
  sessionStorage.removeItem(PORTAL_SESSION_KEY);
  window.location.href = '/login.html';
});

document.addEventListener('click', async (event) => {
  const jumpTab = event.target.closest('[data-jump-tab]');
  if (jumpTab) {
    switchTab(jumpTab.dataset.jumpTab);
    return;
  }

  const openProject = event.target.closest('[data-open-project]');
  if (openProject) {
    switchTab('projects', { projectId: openProject.dataset.openProject, projectSubTab: 'milestones' });
    return;
  }

  const selectProject = event.target.closest('[data-select-project]');
  if (selectProject) {
    portalState.selectedProjectId = selectProject.dataset.selectProject;
    renderProjectsView();
    return;
  }

  const subTab = event.target.closest('[data-project-subtab]');
  if (subTab) {
    portalState.projectSubTab = subTab.dataset.projectSubtab;
    renderProjectsView();
    return;
  }

  const offerFilterBtn = event.target.closest('[data-offer-filter]');
  if (offerFilterBtn) {
    portalState.offerFilter = offerFilterBtn.dataset.offerFilter;
    renderOffersView();
    return;
  }

  const billingFilterBtn = event.target.closest('[data-billing-filter]');
  if (billingFilterBtn) {
    portalState.billingFilter = billingFilterBtn.dataset.billingFilter;
    renderBillingView();
    return;
  }

  const updateFilterBtn = event.target.closest('[data-update-filter]');
  if (updateFilterBtn) {
    portalState.updateProjectFilter = updateFilterBtn.dataset.updateFilter;
    renderUpdatesView();
    return;
  }

  const download = event.target.closest('[data-download-file]');
  if (download) {
    event.preventDefault();
    try {
      const response = await fetch(download.href, {
        headers: { Authorization: `Bearer ${session.token}` }
      });
      if (!response.ok) throw new Error('Download failed.');
      const blobUrl = URL.createObjectURL(await response.blob());
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = '';
      link.click();
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      showPaymentBanner('danger', error.message || 'Unable to download file.');
    }
    return;
  }

  const milestoneDecision = event.target.closest('.milestone-decision');
  if (milestoneDecision) {
    milestoneDecision.disabled = true;
    try {
      await portalFetch(
        `/api/projects/${encodeURIComponent(milestoneDecision.dataset.project)}/milestones/${encodeURIComponent(milestoneDecision.dataset.milestone)}/status`,
        { method: 'PATCH', body: JSON.stringify({ status: milestoneDecision.dataset.status }) }
      );
      await loadPortal();
    } catch (error) {
      showPaymentBanner('danger', error.message);
      milestoneDecision.disabled = false;
    }
    return;
  }

  const decision = event.target.closest('.proposal-decision');
  if (decision) {
    decision.disabled = true;
    try {
      await portalFetch(`/api/proposals/${encodeURIComponent(decision.dataset.id)}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: decision.dataset.status })
      });
      await loadPortal();
    } catch (error) {
      showPaymentBanner('danger', error.message);
      decision.disabled = false;
    }
    return;
  }

  const maintenanceButton = event.target.closest('.maintenance-pay');
  if (maintenanceButton) {
    maintenanceButton.disabled = true;
    try {
      const result = await portalFetch(
        `/api/maintenance/invoices/${encodeURIComponent(maintenanceButton.dataset.invoice)}/checkout`,
        { method: 'POST', body: JSON.stringify({ provider: maintenanceButton.dataset.provider }) }
      );
      if (result.checkoutUrl || result.approvalUrl) {
        window.location.href = result.checkoutUrl || result.approvalUrl;
      } else {
        throw new Error('Payment checkout URL was not returned.');
      }
    } catch (error) {
      showPaymentBanner('danger', error.message);
      maintenanceButton.disabled = false;
    }
    return;
  }

  const openReceiptBtn = event.target.closest('.open-receipt-modal');
  if (openReceiptBtn) {
    openReceiptModal(openReceiptBtn.dataset.receiptType, openReceiptBtn.dataset.receiptId);
    return;
  }

  const pdfBtn = event.target.closest('.download-receipt-pdf');
  if (pdfBtn) {
    downloadReceiptPdf(pdfBtn.dataset.receiptType, pdfBtn.dataset.receiptId, pdfBtn);
    return;
  }

  const button = event.target.closest('.portal-pay');
  if (button) {
    button.disabled = true;
    try {
      const result = await portalFetch(
        `/api/projects/${encodeURIComponent(button.dataset.project)}/milestones/${encodeURIComponent(button.dataset.milestone)}/checkout`,
        { method: 'POST', body: JSON.stringify({ provider: button.dataset.provider }) }
      );
      if (result.checkoutUrl || result.approvalUrl) {
        window.location.href = result.checkoutUrl || result.approvalUrl;
      } else {
        throw new Error('Payment checkout URL was not returned.');
      }
    } catch (error) {
      showPaymentBanner('danger', error.message);
      button.disabled = false;
    }
  }
});

initPortalTheme();
initSidebarShell();
initReceiptModalShell();
initPortalLanguage();
loadPortal();
