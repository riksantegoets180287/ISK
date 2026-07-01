/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet 
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#334155',
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#6366f1',
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  headerSub: {
    fontSize: 9,
    color: '#64748b',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0f766e',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 3,
  },
  paragraph: {
    fontSize: 9.5,
    marginBottom: 8,
    color: '#475569',
  },
  bold: {
    fontWeight: 'bold',
    color: '#1e293b',
  },
  bulletList: {
    marginLeft: 12,
    marginBottom: 10,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  bulletDot: {
    width: 8,
    fontSize: 10,
    color: '#6366f1',
  },
  bulletContent: {
    flex: 1,
    fontSize: 9.5,
    color: '#475569',
  },
  infoBox: {
    backgroundColor: '#f8fafc',
    borderLeftWidth: 3,
    borderLeftColor: '#6366f1',
    padding: 10,
    borderRadius: 4,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 3,
  },
  infoText: {
    fontSize: 9,
    color: '#475569',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: '#94a3b8',
  }
});

export const AdminGuidePdfDocument: React.FC = () => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Beheerdershandleiding (How-To)</Text>
          <Text style={styles.headerSub}>Profiel & Advies ISK • Koppelingen & Wegingen uitgelegd</Text>
        </View>

        {/* Intro */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Wat doet dit systeem?</Text>
          <Text style={styles.paragraph}>
            Dit systeem helpt docenten om snel een objectieve, datagedreven rapportage op te stellen voor ISK-leerlingen. 
            Docenten vullen een korte vragenlijst in over vier thema's: Gedrag, Taal, Sociaal-Emotioneel en Beschermende Factoren. 
            Het systeem berekent direct de scores en koppelt automatisch de juiste adviesblokken via slimme beslisregels.
          </Text>
        </View>

        {/* Weging */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Hoe werkt de weging (Wegingsfactor)?</Text>
          <Text style={styles.paragraph}>
            Elke stelling of vraag heeft een <Text style={styles.bold}>wegingsfactor</Text> (bijvoorbeeld 1.0, 1.2 of 1.5). 
            De weging bepaalt hoe zwaar een specifieke stelling meetelt in de eindrekening van een categorie.
          </Text>
          
          <View style={styles.bulletList}>
            <View style={styles.bulletRow}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletContent}>
                <Text style={styles.bold}>Weging 1.0:</Text> Dit is de standaardwaarde. De vraag telt normaal mee.
              </Text>
            </View>
            <View style={styles.bulletRow}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletContent}>
                <Text style={styles.bold}>Weging {'>'} 1.0 (bijv. 1.5):</Text> Dit geeft aan dat de stelling zeer belangrijk of risicovol is (bijvoorbeeld signaalgedrag rondom veiligheid). De impact op de scores is groter.
              </Text>
            </View>
            <View style={styles.bulletRow}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletContent}>
                <Text style={styles.bold}>Weging {'<'} 1.0 (bijv. 0.8):</Text> De stelling is een extra observatie en weegt minder zwaar mee op het eindpercentage.
              </Text>
            </View>
          </View>

          <Text style={styles.paragraph}>
            <Text style={styles.bold}>Rekenvoorbeeld:</Text> Als een leerling laag scoort op een vraag met een weging van 2.0, daalt het positieve percentage van die categorie veel sneller dan bij een vraag met weging 1.0. Dit zorgt ervoor dat risicogedrag direct opvalt!
          </Text>
        </View>

        {/* Rules & Text Blocks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Hoe koppelt u Tekstblokken aan Beslisregels?</Text>
          <Text style={styles.paragraph}>
            Het systeem genereert rapporten door tekstblokken aan elkaar te plakken. Dit wordt aangestuurd door de <Text style={styles.bold}>Beslisregels (Rule Engine)</Text>.
          </Text>

          <View style={styles.bulletList}>
            <View style={styles.bulletRow}>
              <Text style={styles.bulletDot}>1.</Text>
              <Text style={styles.bulletContent}>
                <Text style={styles.bold}>Stap A: Maak een Tekstblok.</Text> Schrijf eerst de adviestekst in de tab 'Tekstblokken' (bijv. een speciaal handelingsadvies voor leerlingen met een lage taalvaardigheid).
              </Text>
            </View>
            <View style={styles.bulletRow}>
              <Text style={styles.bulletDot}>2.</Text>
              <Text style={styles.bulletContent}>
                <Text style={styles.bold}>Stap B: Maak een Beslisregel.</Text> Ga naar 'Regels beheren' en stel een logische trigger in (bijv. ALS categoriepercentage "Taal & Communicatie" is kleiner dan 50%).
              </Text>
            </View>
            <View style={styles.bulletRow}>
              <Text style={styles.bulletDot}>3.</Text>
              <Text style={styles.bulletContent}>
                <Text style={styles.bold}>Stap C: Koppel ze.</Text> Selecteer in de beslisregel welk Tekstblok er getoond moet worden als de trigger afgaat. Sla de regel op.
              </Text>
            </View>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Tip voor de Beheerder:</Text>
            <Text style={styles.infoText}>
              Gebruik de 'Simulatie Testmodus' tab om uw instellingen te controleren. U kunt de scores handmatig verschuiven om direct te zien welke regels actief worden en hoe de eindrapportage eruit komt te zien!
            </Text>
          </View>
        </View>

        {/* AVG Compliance Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. AVG & Privacy Waarborging</Text>
          <Text style={styles.paragraph}>
            De applicatie is ontworpen om volledig AVG-veilig te zijn. Er worden nooit echte namen van leerlingen opgeslagen. Het systeem genereert automatisch een opeenvolgend casusnummer (bijvoorbeeld: Casus 1, Casus 2, enz.) om de privacy van studenten te waarborgen. Sla eventuele namenlijsten altijd op in een aparte, beveiligde schoolomgeving buiten deze app.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Profiel & Advies ISK - Systeemondersteuning</Text>
          <Text>Pagina 1 van 1</Text>
        </View>
      </Page>
    </Document>
  );
};
