import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function EmpresaInicio() {
  const [selectedPeriod, setSelectedPeriod] = useState('Semana');

  const statsData = [
    {
      title: 'Total de Vistas',
      value: '24,582',
      change: '+12.5%',
      changeType: 'positive',
      icon: '👁️',
      color: '#3b82f6',
    },
    {
      title: 'Total de Aplicantes',
      value: '1,248',
      change: '+8.2%',
      changeType: 'positive',
      icon: '👥',
      color: '#8b5cf6',
    },
    {
      title: 'Tasa de Conversión',
      value: '5.1%',
      change: '+1.8%',
      changeType: 'positive',
      icon: '📈',
      color: '#10b981',
    },
    {
      title: 'Vacantes Activas',
      value: '28',
      change: '-3',
      changeType: 'negative',
      icon: '💼',
      color: '#f59e0b',
    },
  ];

  const vacanciesData = [
    {
      title: 'Desarrollador Frontend',
      company: 'Tiempo Completo • Remoto',
      views: '8,452',
      applicants: '342',
      conversion: '4.0%',
      icon: '💻',
      color: '#3b82f6',
    },
    {
      title: 'Ingeniero de Datos',
      company: 'Tiempo Completo • Presencial',
      views: '6,218',
      applicants: '298',
      conversion: '4.8%',
      icon: '🗄️',
      color: '#8b5cf6',
    },
    {
      title: 'Marketing Digital',
      company: 'Medio Tiempo • Híbrido',
      views: '5,837',
      applicants: '276',
      conversion: '4.7%',
      icon: '📢',
      color: '#10b981',
    },
  ];

  const universitiesData = [
    { name: 'Universidad de Sonora', type: 'Pública', applicants: 312, progress: 85, color: '#6366f1' },
    { name: 'Tecnológico de Monterrey', type: 'Privada', applicants: 264, progress: 72, color: '#f59e0b' },
    { name: 'UNAM', type: 'Pública', applicants: 249, progress: 68, color: '#10b981' },
    { name: 'Universidad Autónoma', type: 'Pública', applicants: 209, progress: 57, color: '#ef4444' },
    { name: 'ITH', type: 'Pública', applicants: 158, progress: 43, color: '#3b82f6' },
  ];

  const careersData = [
    { name: 'Ingeniería en Sistemas', category: 'Computación', applicants: 385, progress: 89, icon: '💻', color: '#8b5cf6' },
    { name: 'Administración de Empresas', category: 'Negocios', applicants: 286, progress: 76, icon: '📊', color: '#ec4899' },
    { name: 'Diseño Gráfico', category: 'Artes', applicants: 197, progress: 65, icon: '🎨', color: '#14b8a6' },
    { name: 'Contabilidad', category: 'Finanzas', applicants: 182, progress: 60, icon: '🧮', color: '#6366f1' },
    { name: 'Marketing', category: 'Negocios', applicants: 156, progress: 52, icon: '📈', color: '#f59e0b' },
  ];

  const quickActionsData = [
    { title: 'Crear Vacante', icon: '➕', color: '#8b5cf6' },
    { title: 'Ver Aplicantes', icon: '👥', color: '#10b981' },
    { title: 'Reportes', icon: '📊', color: '#f59e0b' },
    { title: 'Configuración', icon: '⚙️', color: '#ef4444' },
  ];

  const periods = ['Día', 'Semana', 'Mes', 'Año'];

  const StatCard = ({ item }) => (
    <View style={styles.statCard}>
      <View style={styles.statHeader}>
        <Text style={styles.statTitle}>{item.title}</Text>
        <View style={[styles.statIcon, { backgroundColor: item.color }]}>
          <Text style={styles.iconText}>{item.icon}</Text>
        </View>
      </View>
      <Text style={styles.statValue}>{item.value}</Text>
      <View style={styles.statChangeContainer}>
        <Text style={styles.arrow}>
          {item.changeType === 'positive' ? '↗️' : '↘️'}
        </Text>
        <Text
          style={[
            styles.statChange,
            { color: item.changeType === 'positive' ? '#10b981' : '#ef4444' }
          ]}
        >
          {item.change} desde el mes pasado
        </Text>
      </View>
    </View>
  );

  const VacancyCard = ({ item }) => (
    <TouchableOpacity style={styles.vacancyCard} activeOpacity={0.8}>
      <View style={styles.vacancyHeader}>
        <View style={[styles.vacancyIcon, { backgroundColor: item.color }]}>
          <Text style={styles.vacancyIconText}>{item.icon}</Text>
        </View>
        <View style={styles.vacancyInfo}>
          <Text style={styles.vacancyTitle}>{item.title}</Text>
          <Text style={styles.vacancyCompany}>{item.company}</Text>
        </View>
      </View>
      <View style={styles.vacancyStats}>
        <View style={styles.vacancyStat}>
          <Text style={styles.vacancyStatValue}>{item.views}</Text>
          <Text style={styles.vacancyStatLabel}>Vistas</Text>
        </View>
        <View style={styles.vacancyStat}>
          <Text style={styles.vacancyStatValue}>{item.applicants}</Text>
          <Text style={styles.vacancyStatLabel}>Aplicantes</Text>
        </View>
        <View style={styles.vacancyStat}>
          <Text style={styles.vacancyStatValue}>{item.conversion}</Text>
          <Text style={styles.vacancyStatLabel}>Conversión</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const UniversityItem = ({ item }) => (
    <TouchableOpacity style={styles.listItem} activeOpacity={0.7}>
      <View style={styles.listItemInfo}>
        <View style={[styles.listItemIcon, { backgroundColor: item.color }]}>
          <Text style={styles.listIconText}>🏫</Text>
        </View>
        <View style={styles.listItemText}>
          <Text style={styles.listItemTitle}>{item.name}</Text>
          <Text style={styles.listItemSubtitle}>{item.type}</Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${item.progress}%`, backgroundColor: item.color }
              ]}
            />
          </View>
        </View>
      </View>
      <Text style={styles.listItemValue}>{item.applicants}</Text>
    </TouchableOpacity>
  );

  const CareerItem = ({ item }) => (
    <TouchableOpacity style={styles.listItem} activeOpacity={0.7}>
      <View style={styles.listItemInfo}>
        <View style={[styles.listItemIcon, { backgroundColor: item.color }]}>
          <Text style={styles.listIconText}>{item.icon}</Text>
        </View>
        <View style={styles.listItemText}>
          <Text style={styles.listItemTitle}>{item.name}</Text>
          <Text style={styles.listItemSubtitle}>{item.category}</Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${item.progress}%`, backgroundColor: item.color }
              ]}
            />
          </View>
        </View>
      </View>
      <Text style={styles.listItemValue}>{item.applicants}</Text>
    </TouchableOpacity>
  );

  const PeriodButton = ({ period }) => (
    <TouchableOpacity
      style={[
        styles.periodButton,
        selectedPeriod === period && styles.periodButtonActive
      ]}
      onPress={() => setSelectedPeriod(period)}
    >
      <Text
        style={[
          styles.periodButtonText,
          selectedPeriod === period && styles.periodButtonActiveText
        ]}
      >
        {period}
      </Text>
    </TouchableOpacity>
  );

  const QuickActionCard = ({ item, onPress }) => (
    <TouchableOpacity style={styles.quickActionCard} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.quickActionIcon, { backgroundColor: item.color }]}>
        <Text style={styles.quickActionIconText}>{item.icon}</Text>
      </View>
      <Text style={styles.quickActionText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f4f7fe" />
      
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Dashboard de Empresa</Text>
            <Text style={styles.headerSubtitle}>Monitorea tus vacantes y aplicantes</Text>
          </View>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
            <Text style={styles.actionButtonIcon}>➕</Text>
            <Text style={styles.actionButtonText}>Nueva Vacante</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          {statsData.map((item, index) => (
            <StatCard key={index} item={item} />
          ))}
        </View>

        {/* Chart Section */}
        <View style={styles.chartSection}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Vistas de la Empresa</Text>
            <View style={styles.chartPeriods}>
              {periods.map((period) => (
                <PeriodButton key={period} period={period} />
              ))}
            </View>
          </View>
          <View style={styles.chartPlaceholder}>
            <View style={styles.chartIconContainer}>
              <Text style={styles.chartIcon}>📊</Text>
            </View>
            <Text style={styles.chartPlaceholderText}>Gráfico de vistas - {selectedPeriod}</Text>
            <Text style={styles.chartPlaceholderSubtext}>Los datos se actualizarán automáticamente</Text>
          </View>
        </View>

        {/* Vacancy Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vacantes Destacadas</Text>
          {vacanciesData.map((item, index) => (
            <VacancyCard key={index} item={item} />
          ))}
        </View>

        {/* Universities List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Universidades</Text>
            <Text style={styles.sectionSubtitle}>Las instituciones con más aplicantes</Text>
          </View>
          <View style={styles.listContainer}>
            {universitiesData.map((item, index) => (
              <UniversityItem key={index} item={item} />
            ))}
          </View>
        </View>

        {/* Careers List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Carreras</Text>
            <Text style={styles.sectionSubtitle}>Las formaciones más solicitadas</Text>
          </View>
          <View style={styles.listContainer}>
            {careersData.map((item, index) => (
              <CareerItem key={index} item={item} />
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <View style={styles.actionsGrid}>
            {quickActionsData.map((item, index) => (
              <QuickActionCard
                key={index}
                item={item}
                onPress={() => console.log(item.title)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7fe',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 25,
    paddingTop: 10,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 15,
  },
  actionButtonIcon: {
    color: 'white',
    fontSize: 16,
    marginRight: 8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    width: (width - 55) / 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statTitle: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
    flex: 1,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 20,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  statChangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  arrow: {
    fontSize: 12,
  },
  statChange: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
  chartSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chartHeader: {
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 15,
  },
  chartPeriods: {
    flexDirection: 'row',
    gap: 8,
  },
  periodButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  periodButtonActive: {
    backgroundColor: '#eef2ff',
  },
  periodButtonText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  periodButtonActiveText: {
    color: '#4f46e5',
    fontWeight: '600',
  },
  chartPlaceholder: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 20,
  },
  chartIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  chartIcon: {
    fontSize: 40,
  },
  chartPlaceholderText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  chartPlaceholderSubtext: {
    color: '#9ca3af',
    fontSize: 14,
    textAlign: 'center',
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  vacancyCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  vacancyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 15,
  },
  vacancyIcon: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vacancyIconText: {
    fontSize: 24,
  },
  vacancyInfo: {
    flex: 1,
  },
  vacancyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 3,
  },
  vacancyCompany: {
    fontSize: 14,
    color: '#6b7280',
  },
  vacancyStats: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  vacancyStat: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
  },
  vacancyStatValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  vacancyStatLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 3,
  },
  listContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  listItemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  listItemIcon: {
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listIconText: {
    fontSize: 16,
  },
  listItemText: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  listItemSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    marginTop: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  listItemValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    minWidth: 60,
    textAlign: 'right',
  },
  quickActions: {
    marginBottom: 25,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    width: (width - 55) / 2,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  quickActionIconText: {
    fontSize: 24,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    textAlign: 'center',
  },
});