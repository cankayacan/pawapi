export const APPOINTMENT_EMAIL_SUBJECT = 'Pawimo Terminbestätigung';
export const APPOINTMENT_EMAIL_CONTENT = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
    <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 8px;">
      <h1 style="font-size: 20px; color: #333; margin-bottom: 20px;">Bestätigung Deines Termins bei Pawimo</h1>
      <p style="margin-bottom: 20px;">Lieber Pawimo-Nutzer,</p>
      <p style="margin-bottom: 20px;">
        Vielen Dank, dass Du unseren mobilen Tierarztservice gewählt hast. Wir freuen uns, Dir mitteilen zu können, dass Dein Termin erfolgreich geplant wurde. Hier sind die Details zu Deinem Termin:
      </p>
      <div style="background-color: #fff; padding: 15px; border-radius: 8px; border: 1px solid #ddd; margin-bottom: 20px;">
        <p style="margin: 5px 0;"><strong>Datum:</strong> @@appointmentDate@@</p>
        <p style="margin: 5px 0;"><strong>Uhrzeit:</strong> @@appointmentTime@@</p>
        <p style="margin: 5px 0;"><strong>Service:</strong> @@appointmentReason@@</p>
      </div>
      <p style="margin-bottom: 20px;">
        Bitte stelle sicher, dass Du zur angegebenen Zeit bereit bist, damit unser Tierarzt Deinen Liebling bestmöglich betreuen kann. Solltest Du weitere Informationen zu Deinem Haustier oder Deinem Anliegen hinzufügen wollen, kannst Du uns jederzeit kontaktieren.
      </p>
      <p style="margin-bottom: 20px;">
        Falls Du den Termin verschieben oder stornieren möchtest, gib uns bitte mindestens 24 Stunden vorher Bescheid, damit wir den Terminplatz freigeben können.
      </p>
      <p style="margin-bottom: 10px;"><strong>Kontakt:</strong></p>
      <p style="margin-bottom: 5px;">📞 +49 1575 264 65 65</p>
      <p style="margin-bottom: 20px;">📧 info@pawimo.com</p>
      <p style="margin-bottom: 20px;">Wir freuen uns darauf, Dir und Deinem Haustier helfen zu können.</p>
      <p style="font-size: 14px; color: #777;">Herzliche Grüße,</p>
      <p style="font-size: 14px; color: #777;">Dein Pawimo Support-Team</p>
    </div>
  </div>
`;
