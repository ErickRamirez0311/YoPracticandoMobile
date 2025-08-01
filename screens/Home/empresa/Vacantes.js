import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  FlatList,
  Modal,
  Dimensions,
} from 'react-native';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Play,
  Pause,
  Eye,
  Ban,
  Trash2,
  CheckCircle,
  Copy,
  AlertTriangle,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

// Datos mock para mostrar el diseño
const mockVacantes = [
  {
    id: 1,
    titulo: 'Desarrollador Frontend React',
    num_aplicaciones: 12,
    estado: 'Activo',
    fecha_publicacion: '2024-01-15',
    fecha_expiracion: '2024-02-15'
  },
  {
    id: 2,
    titulo: 'Diseñador UX/UI Senior',
    num_aplicaciones: 8,
    estado: 'Pausada',
    fecha_publicacion: '2024-01-10',
    fecha_expiracion: '2024-02-10'
  },
  {
    id: 3,
    titulo: 'Analista de Datos',
    num_aplicaciones: 5,
    estado: 'Expirada',
    fecha_publicacion: '2023-12-20',
    fecha_expiracion: '2024-01-20'
  },
  {
    id: 4,
    titulo: 'Marketing Digital Specialist',
    num_aplicaciones: 15,
    estado: 'Desactivada',
    fecha_publicacion: '2024-01-08',
    fecha_expiracion: '2024-02-08'
  }
];

export default function VacantesScreen({ navigation }) {
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedVacante, setSelectedVacante] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('todos');
  const [sortOrder, setSortOrder] = useState('reciente');
  const [filteredVacantes, setFilteredVacantes] = useState(mockVacantes);
  
  // Simular datos incompletos para mostrar la alerta (cambiar a true para ocultar)
  const [datosCompletos] = useState(false);
  const [camposFaltantes] = useState(['Logo', 'Descripción', 'Ubicación']);

  const handleCrearVacante = () => {
    if (!datosCompletos) {
      // Mostrar alerta pero permitir navegar para demo
      setTimeout(() => {
        navigation.navigate('CrearVacante');
      }, 100);
      return;
    }
    navigation.navigate('CrearVacante');
  };

  const handleVacanteAction = (vacante, action) => {
    setSelectedVacante(vacante);
    
    if (action === 'menu') {
      setShowActionModal(true);
      return;
    }

    if (action === 'ver') {
      // navigation.navigate('DetalleVacante', { vacanteId: vacante.id });
      return;
    }

    if (action === 'editar') {
      // navigation.navigate('EditarVacante', { vacanteId: vacante.id });
      return;
    }

    if (action === 'copiar') {
      // Simular copiar enlace
      alert('Link copiado al portapapeles');
      return;
    }

    // Para otras acciones, solo cerrar el modal
    setShowActionModal(false);
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Activo':
        return [styles.statusBadge, styles.statusActive];
      case 'Pausada':
        return [styles.statusBadge, styles.statusPaused];
      case 'Desactivada':
        return [styles.statusBadge, styles.statusDeactivated];
      default:
        return [styles.statusBadge, styles.statusExpired];
    }
  };

  const formatFecha = (fecha) => {
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
                   'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const date = new Date(fecha);
    const dia = date.getDate();
    const mes = meses[date.getMonth()];
    const año = date.getFullYear();
    return `${dia} ${mes} ${año}`;
  };

  const renderVacanteItem = ({ item }) => (
    <View style={styles.vacanteCard}>
      <View style={styles.vacanteHeader}>
        <View style={styles.vacanteInfo}>
          <Text style={styles.vacanteTitle}>{item.titulo}</Text>
          <View style={getStatusBadgeStyle(item.estado)}>
            <Text style={[styles.statusText, { 
              color: item.estado === 'Activo' ? '#166534' : 
                     item.estado === 'Pausada' ? '#92400e' :
                     item.estado === 'Desactivada' ? '#4b5563' : '#991b1b'
            }]}>
              {item.estado}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => handleVacanteAction(item, 'menu')}
        >
          <MoreVertical size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>

      <View style={styles.vacanteDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Solicitantes:</Text>
          <TouchableOpacity>
            <Text style={styles.detailValue}>
              {item.num_aplicaciones} candidato{item.num_aplicaciones !== 1 ? 's' : ''}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Publicado:</Text>
          <Text style={styles.detailValue}>{formatFecha(item.fecha_publicacion)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Expira:</Text>
          <Text style={styles.detailValue}>{formatFecha(item.fecha_expiracion)}</Text>
        </View>
      </View>
    </View>
  );

  const ActionModal = () => (
    <Modal
      visible={showActionModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowActionModal(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setShowActionModal(false)}
      >
        <View style={styles.actionModal}>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => {
              setShowActionModal(false);
              handleVacanteAction(selectedVacante, 'ver');
            }}
          >
            <Eye size={20} color="#3b82f6" />
            <Text style={styles.actionText}>Ver vacante</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => {
              setShowActionModal(false);
              handleVacanteAction(selectedVacante, 'copiar');
            }}
          >
            <Copy size={20} color="#8b5cf6" />
            <Text style={styles.actionText}>Copiar Link</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => {
              setShowActionModal(false);
              handleVacanteAction(selectedVacante, 'editar');
            }}
          >
            <Edit size={20} color="#2563eb" />
            <Text style={styles.actionText}>Editar</Text>
          </TouchableOpacity>

          {selectedVacante?.estado === 'Activo' && (
            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => setShowActionModal(false)}
            >
              <Pause size={20} color="#f59e0b" />
              <Text style={styles.actionText}>Pausar</Text>
            </TouchableOpacity>
          )}

          {selectedVacante?.estado === 'Pausada' && (
            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => setShowActionModal(false)}
            >
              <Play size={20} color="#16a34a" />
              <Text style={styles.actionText}>Reanudar</Text>
            </TouchableOpacity>
          )}

          <View style={styles.divider} />

          {selectedVacante?.estado === 'Desactivada' ? (
            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => setShowActionModal(false)}
            >
              <CheckCircle size={20} color="#16a34a" />
              <Text style={styles.actionText}>Activar</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => setShowActionModal(false)}
            >
              <Ban size={20} color="#6b7280" />
              <Text style={styles.actionText}>Desactivar</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.actionItem, styles.deleteAction]}
            onPress={() => setShowActionModal(false)}
          >
            <Trash2 size={20} color="#dc2626" />
            <Text style={[styles.actionText, styles.deleteText]}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Vacantes</Text>
        <TouchableOpacity
          style={[
            styles.createButton,
            !datosCompletos && styles.createButtonDisabled
          ]}
          onPress={handleCrearVacante}
        >
          <Plus size={20} color="#ffffff" />
          <Text style={styles.createButtonText}>Crear</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Alerta de datos incompletos */}
        {!datosCompletos && (
          <View style={styles.alertCard}>
            <View style={styles.alertHeader}>
              <AlertTriangle size={20} color="#f97316" />
              <Text style={styles.alertTitle}>¡Información de empresa incompleta!</Text>
            </View>
            <Text style={styles.alertText}>
              Para publicar vacantes, es necesario completar todos los datos obligatorios de tu empresa.
            </Text>
            {camposFaltantes.length > 0 && (
              <Text style={styles.alertSubtext}>
                Campos pendientes: {camposFaltantes.join(', ')}
              </Text>
            )}
            <TouchableOpacity
              style={styles.alertButton}
              onPress={() => navigation.navigate('InformacionEmpresa')}
            >
              <Text style={styles.alertButtonText}>Completar información</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Filtros */}
        <View style={styles.filtersCard}>
          <TouchableOpacity
            style={styles.filtersToggle}
            onPress={() => setShowFilters(!showFilters)}
          >
            <View style={styles.filtersToggleLeft}>
              <Filter size={20} color="#6b7280" />
              <Text style={styles.filtersToggleText}>Filtros</Text>
            </View>
            <Text style={styles.filtersToggleIcon}>{showFilters ? '−' : '+'}</Text>
          </TouchableOpacity>

          {showFilters && (
            <View style={styles.filtersContent}>
              {/* Búsqueda */}
              <View style={styles.searchContainer}>
                <Search size={20} color="#6b7280" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Buscar vacante..."
                  value={searchText}
                  onChangeText={setSearchText}
                />
              </View>

              {/* Filtros de estado y orden */}
              <View style={styles.filterRow}>
                <View style={styles.filterGroup}>
                  <Text style={styles.filterLabel}>Estado:</Text>
                  <View style={styles.filterButtons}>
                    {[
                      { key: 'todos', label: 'Todos' },
                      { key: 'activas', label: 'Activas' },
                      { key: 'pausadas', label: 'Pausadas' },
                      { key: 'expiradas', label: 'Expiradas' },
                      { key: 'desactivadas', label: 'Desactivadas' }
                    ].map(filter => (
                      <TouchableOpacity
                        key={filter.key}
                        style={[
                          styles.filterButton,
                          selectedStatus === filter.key && styles.filterButtonActive
                        ]}
                        onPress={() => setSelectedStatus(filter.key)}
                      >
                        <Text
                          style={[
                            styles.filterButtonText,
                            selectedStatus === filter.key && styles.filterButtonTextActive
                          ]}
                        >
                          {filter.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.filterGroup}>
                  <Text style={styles.filterLabel}>Orden:</Text>
                  <View style={styles.filterButtons}>
                    {[
                      { key: 'reciente', label: 'Reciente' },
                      { key: 'antiguo', label: 'Antiguo' }
                    ].map(sort => (
                      <TouchableOpacity
                        key={sort.key}
                        style={[
                          styles.filterButton,
                          sortOrder === sort.key && styles.filterButtonActive
                        ]}
                        onPress={() => setSortOrder(sort.key)}
                      >
                        <Text
                          style={[
                            styles.filterButtonText,
                            sortOrder === sort.key && styles.filterButtonTextActive
                          ]}
                        >
                          {sort.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Lista de vacantes */}
        <View style={styles.vacantesContainer}>
          {filteredVacantes.length > 0 ? (
            <FlatList
              data={filteredVacantes}
              renderItem={renderVacanteItem}
              keyExtractor={item => item.id.toString()}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No has creado ninguna vacante aún.
              </Text>
              <TouchableOpacity
                style={styles.emptyStateButton}
                onPress={() => navigation.navigate('CrearVacante')}
              >
                <Text style={styles.emptyStateButtonText}>Crear tu primera vacante</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      <ActionModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7ff',
  },
  header: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  createButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  createButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  createButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  alertCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#f97316',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f97316',
  },
  alertText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
    lineHeight: 20,
  },
  alertSubtext: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 12,
  },
  alertButton: {
    alignSelf: 'flex-start',
  },
  alertButtonText: {
    color: '#2563eb',
    fontWeight: '500',
    fontSize: 14,
  },
  filtersCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  filtersToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  filtersToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filtersToggleText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  filtersToggleIcon: {
    fontSize: 20,
    fontWeight: '500',
    color: '#6b7280',
  },
  filtersContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  filterRow: {
    gap: 16,
  },
  filterGroup: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterButtonActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  vacantesContainer: {
    flex: 1,
  },
  vacanteCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  vacanteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  vacanteInfo: {
    flex: 1,
    paddingRight: 16,
  },
  vacanteTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
    lineHeight: 22,
  },
  moreButton: {
    padding: 4,
    borderRadius: 6,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: '#dcfce7',
  },
  statusPaused: {
    backgroundColor: '#fef3c7',
  },
  statusDeactivated: {
    backgroundColor: '#e5e7eb',
  },
  statusExpired: {
    backgroundColor: '#fee2e2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  vacanteDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '500',
  },
  emptyState: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
  },
  emptyStateButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: '#ffffff',
    fontWeight: '500',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionModal: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    minWidth: 200,
    maxWidth: 280,
    overflow: 'hidden',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  actionText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  deleteAction: {
    backgroundColor: '#fef2f2',
  },
  deleteText: {
    color: '#dc2626',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 4,
  },
});