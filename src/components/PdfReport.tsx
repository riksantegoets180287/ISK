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
  StyleSheet, 
  PDFViewer, 
  PDFDownloadLink 
} from '@react-pdf/renderer';
import { Analysis, Category, TextBlock } from '../types';

// Create styles for PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#334155',
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  headerSub: {
    fontSize: 9,
    color: '#64748b',
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f766e',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 4,
  },
  profileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 6,
  },
  profileItem: {
    width: '50%',
    marginBottom: 8,
  },
  label: {
    fontSize: 8,
    color: '#64748b',
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  scoreCatName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1e293b',
    width: '40%',
  },
  scoreBarBg: {
    width: '40%',
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  scoreText: {
    fontSize: 10,
    fontWeight: 'bold',
    width: '15%',
    textAlign: 'right',
  },
  reportBlock: {
    marginBottom: 10,
    backgroundColor: '#ffffff',
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#cbd5e1',
  },
  blockTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  blockContent: {
    fontSize: 9.5,
    lineHeight: 1.4,
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

interface PdfDocumentProps {
  analysis: Analysis;
  categories: Category[];
  textblocks: TextBlock[];
  schoolName: string;
  headerTitle: string;
  primaryColor: string;
  secondaryColor: string;
}

export const AnalysisPdfDocument: React.FC<PdfDocumentProps> = ({
  analysis,
  categories,
  textblocks,
  schoolName,
  headerTitle,
  primaryColor,
  secondaryColor,
}) => {
  // Helpers
  const getCategoryName = (id: string) => {
    return categories.find((c) => c.id === id)?.name || id;
  };

  const getTextBlock = (id: string) => {
    return textblocks.find((tb) => tb.id === id);
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: primaryColor }]}>{headerTitle}</Text>
          <Text style={styles.headerSub}>{schoolName} | Genereerdatum: {new Date(analysis.createdAt).toLocaleDateString('nl-NL')}</Text>
        </View>

        {/* Student Profile */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: secondaryColor }]}>Studentprofiel</Text>
          <View style={styles.profileGrid}>
            <View style={styles.profileItem}>
              <Text style={styles.label}>Naam student</Text>
              <Text style={styles.value}>{analysis.studentName}</Text>
            </View>
            <View style={styles.profileItem}>
              <Text style={styles.label}>Leeftijd</Text>
              <Text style={styles.value}>{analysis.profile.age} jaar</Text>
            </View>
            <View style={styles.profileItem}>
              <Text style={styles.label}>Tijd in Nederland</Text>
              <Text style={styles.value}>{analysis.profile.timeInNL}</Text>
            </View>
            <View style={styles.profileItem}>
              <Text style={styles.label}>Tijd in onderwijs / ISK</Text>
              <Text style={styles.value}>{analysis.profile.timeInEducation}</Text>
            </View>
            <View style={styles.profileItem}>
              <Text style={styles.label}>Thuissituatie</Text>
              <Text style={styles.value}>{analysis.profile.homeSituation}</Text>
            </View>
            <View style={styles.profileItem}>
              <Text style={styles.label}>Schoolverleden</Text>
              <Text style={styles.value}>{analysis.profile.schoolHistory}</Text>
            </View>
          </View>
        </View>

        {/* Scores */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: secondaryColor }]}>Scores per categorie</Text>
          {categories.map((cat) => {
            const score = analysis.categoryScores[cat.id];
            if (!score) return null;
            
            // Determine color based on percentage
            let barColor = '#ef4444'; // Red
            if (score.percentage >= 70) barColor = '#10b981'; // Green
            else if (score.percentage >= 50) barColor = '#f59e0b'; // Amber

            return (
              <View key={cat.id} style={styles.scoreRow}>
                <Text style={styles.scoreCatName}>{cat.name}</Text>
                <View style={styles.scoreBarBg}>
                  <View style={[styles.scoreBarFill, { width: `${score.percentage}%`, backgroundColor: barColor }]} />
                </View>
                <Text style={[styles.scoreText, { color: barColor }]}>{score.percentage}%</Text>
              </View>
            );
          })}
        </View>

        {/* Profielschets */}
        {analysis.generatedReport.Profielschets.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: secondaryColor }]}>Profielschets</Text>
            {analysis.generatedReport.Profielschets.map((tbId) => {
              const tb = getTextBlock(tbId);
              if (!tb) return null;
              return (
                <View key={tbId} style={[styles.reportBlock, { borderLeftColor: primaryColor }]}>
                  <Text style={styles.blockTitle}>{tb.title}</Text>
                  <Text style={styles.blockContent}>{tb.content}</Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Footer for first page */}
        <View style={styles.footer}>
          <Text>{analysis.studentName} - {schoolName}</Text>
          <Text>Pagina 1</Text>
        </View>
      </Page>

      {/* Second Page for Advices and Next Steps */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: primaryColor }]}>{headerTitle}</Text>
          <Text style={styles.headerSub}>{analysis.studentName} | Handelingsadvies & Vervolgstappen</Text>
        </View>

        {/* Handelingsadvies */}
        {analysis.generatedReport.Handelingsadvies.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: secondaryColor }]}>Handelingsadvies</Text>
            {analysis.generatedReport.Handelingsadvies.map((tbId) => {
              const tb = getTextBlock(tbId);
              if (!tb) return null;
              return (
                <View key={tbId} style={[styles.reportBlock, { borderLeftColor: secondaryColor }]}>
                  <Text style={styles.blockTitle}>{tb.title}</Text>
                  <Text style={styles.blockContent}>{tb.content}</Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Reflectiestimulering */}
        {analysis.generatedReport.Reflectiestimulering.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: secondaryColor }]}>Reflectiestimulering</Text>
            {analysis.generatedReport.Reflectiestimulering.map((tbId) => {
              const tb = getTextBlock(tbId);
              if (!tb) return null;
              return (
                <View key={tbId} style={[styles.reportBlock, { borderLeftColor: '#8b5cf6' }]}>
                  <Text style={styles.blockTitle}>{tb.title}</Text>
                  <Text style={styles.blockContent}>{tb.content}</Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Advies vervolgstappen */}
        {analysis.generatedReport['Advies vervolgstappen'].length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: secondaryColor }]}>Advies vervolgstappen</Text>
            {analysis.generatedReport['Advies vervolgstappen'].map((tbId) => {
              const tb = getTextBlock(tbId);
              if (!tb) return null;
              return (
                <View key={tbId} style={[styles.reportBlock, { borderLeftColor: '#f97316' }]}>
                  <Text style={styles.blockTitle}>{tb.title}</Text>
                  <Text style={styles.blockContent}>{tb.content}</Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Custom Notes */}
        {analysis.customNotes && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: secondaryColor }]}>Observaties & Opmerkingen</Text>
            <View style={[styles.reportBlock, { borderLeftColor: '#64748b', backgroundColor: '#f8fafc' }]}>
              <Text style={styles.blockContent}>{analysis.customNotes}</Text>
            </View>
          </View>
        )}

        {/* Footer for second page */}
        <View style={styles.footer}>
          <Text>{analysis.studentName} - {schoolName}</Text>
          <Text>Pagina 2</Text>
        </View>
      </Page>
    </Document>
  );
};

interface DownloadLinkProps {
  analysis: Analysis;
  categories: Category[];
  textblocks: TextBlock[];
  settings: any;
}

export const PdfDownloadButton: React.FC<DownloadLinkProps> = ({
  analysis,
  categories,
  textblocks,
  settings,
}) => {
  return (
    <PDFDownloadLink
      document={
        <AnalysisPdfDocument
          analysis={analysis}
          categories={categories}
          textblocks={textblocks}
          schoolName={settings.pdfSettings.schoolName}
          headerTitle={settings.pdfSettings.headerTitle}
          primaryColor={settings.pdfSettings.primaryColor}
          secondaryColor={settings.pdfSettings.secondaryColor}
        />
      }
      fileName={`Profielanalyse_${analysis.studentName.replace(/\s+/g, '_')}.pdf`}
      className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-lg text-sm transition-colors shadow-sm duration-200 cursor-pointer"
    >
      {({ blob, url, loading, error }) => 
        loading ? 'PDF genereren...' : 'Download PDF'
      }
    </PDFDownloadLink>
  );
};
