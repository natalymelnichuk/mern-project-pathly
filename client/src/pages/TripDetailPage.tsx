import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Calendar,
  MapPin,
  Trash2,
  Wallet,
  PiggyBank,
  Receipt,
  ListTodo,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import API from '../services/api';
import { ThemeToggle } from '../components/ThemeToggle';
import type { Trip } from '../types/trip';
import type { Activity, ActivityStatus } from '../types/activity';


export const TripDetailPage: React.FC = () => {
  const location = useLocation();
  const tripId = location.state?.tripId;

  const [trip, setTrip] = useState<Trip | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Sightseeing');
  const [newCost, setNewCost] = useState<number | ''>('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newStatus, setNewStatus] = useState<ActivityStatus>('To Do');
  const [newLocationName, setNewLocationName] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!tripId) {
        setLoading(false);
        return;
      }

      try {
        const [tripRes, activitiesRes] = await Promise.all([
          API.get(`/trips/${tripId}`),
          API.get(`/trips/${tripId}/activities`),
        ]);

        if (isMounted) {
          setTrip(tripRes.data);
          setActivities(activitiesRes.data);
        }
      } catch (err) {
        console.error('Failed to load trip details:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [tripId]);

  // Подсчёт расходов и остатка бюджета
  const totalSpent = activities.reduce((sum, act) => sum + (act.cost || 0), 0);
  const remainingBudget = (trip?.totalBudget || 0) - totalSpent;

  // Создание активности с передачей статуса
  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tripId) return;

    setCreateLoading(true);
    try {
      const res = await API.post(`/trips/${tripId}/activities`, {
        title: newTitle,
        category: newCategory,
        cost: Number(newCost) || 0,
        date: newDate,
        status: newStatus,
        location: {
          name: newLocationName || undefined,
        },
      });

      setActivities((prev) => [...prev, res.data]);
      setNewTitle('');
      setNewLocationName('');
      setNewCost('');
      setNewStatus('To Do');
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to create activity:', err);
    } finally {
      setCreateLoading(false);
    }
  };

  // Изменение статуса активности (перемещение между колонками)
  const handleStatusChange = async (activityId: string, status: ActivityStatus) => {
    try {
      setActivities((prev) =>
        prev.map((act) => (act._id === activityId ? { ...act, status } : act))
      );

      await API.put(`/activities/${activityId}`, { status });
    } catch (err) {
      console.error('Failed to update activity status:', err);
      if (tripId) {
        const res = await API.get(`/trips/${tripId}/activities`);
        setActivities(res.data);
      }
    }
  };

  // Удаление активности
  const handleDeleteActivity = async (activityId: string) => {
    try {
      await API.delete(`/activities/${activityId}`);
      setActivities((prev) => prev.filter((act) => act._id !== activityId));
    } catch (err) {
      console.error('Failed to delete activity:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-8 text-center flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Trip not found</h2>
        <p className="text-slate-400 mb-6">
          Could not retrieve trip details. Please navigate back to the dashboard.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    );
  }

  const todoList = activities.filter((a) => a.status === 'To Do');
  const inProgressList = activities.filter((a) => a.status === 'In Progress');
  const doneList = activities.filter((a) => a.status === 'Done');

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-100/90 via-orange-200/60 to-sky-200 dark:from-rose-800/80 dark:via-rose-950/80 dark:to-[#132652] text-slate-800 dark:text-slate-100 transition-colors duration-500 pb-16">
      
      {/* Навигация */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/40 dark:bg-slate-800/40 border border-white/50 dark:border-slate-700/50 hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
        <ThemeToggle />
      </div>

      <main className="max-w-7xl mx-auto px-6">
        {/* Баннер поездки и расчёт бюджета */}
        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/50 dark:border-slate-700/50 rounded-3xl p-6 sm:p-8 shadow-xl mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
            <div>
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold mb-2">
                <MapPin className="w-5 h-5" />
                <span>{trip.destination}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#132652] dark:text-[#F8FAFC]">
                {trip.title}
              </h1>
              <div className="flex items-center gap-2 mt-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                <Calendar className="w-4 h-4 text-emerald-500" />
                <span>
                  {new Date(trip.startDate).toLocaleDateString()} -{' '}
                  {new Date(trip.endDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-semibold bg-[#059669] hover:bg-[#082D0F] dark:bg-[#0d4037] dark:hover:bg-[#059669] text-white shadow-lg transition-all duration-300 self-start lg:self-center"
            >
              <Plus className="w-5 h-5" />
              <span>Add Activity</span>
            </button>
          </div>

          {/* Карточки бюджетов: Total Budget, Expenses, Remaining */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-200/50 dark:border-slate-800/50">
            <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Budget</span>
                <p className="text-xl font-bold text-slate-800 dark:text-slate-100">${trip.totalBudget}</p>
              </div>
            </div>

            <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-rose-500/10 text-rose-500">
                <Receipt className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Expenses</span>
                <p className="text-xl font-bold text-rose-600 dark:text-rose-400">${totalSpent}</p>
              </div>
            </div>

            <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 flex items-center gap-4">
              <div className={`p-3 rounded-xl ${remainingBudget < 0 ? 'bg-red-500/10 text-red-500' : 'bg-sky-500/10 text-sky-500'}`}>
                <PiggyBank className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Remaining Budget</span>
                <p className={`text-xl font-bold ${remainingBudget < 0 ? 'text-red-500' : 'text-slate-800 dark:text-slate-100'}`}>
                  ${remainingBudget}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* --- KANBAN BOARD --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KanbanColumn
            title="To Do"
            icon={<ListTodo className="w-5 h-5 text-amber-500" />}
            count={todoList.length}
            activities={todoList}
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteActivity}
          />

          <KanbanColumn
            title="In Progress"
            icon={<Clock className="w-5 h-5 text-sky-500" />}
            count={inProgressList.length}
            activities={inProgressList}
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteActivity}
          />

          <KanbanColumn
            title="Done"
            icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}
            count={doneList.length}
            activities={doneList}
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteActivity}
          />
        </div>
      </main>

      {/* Модалка добавления активности */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/50 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10">
            <h2 className="text-2xl font-bold text-[#132652] dark:text-[#F8FAFC] mb-6">
              Add New Activity
            </h2>

            <form onSubmit={handleCreateActivity} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Visit Colosseum"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-[#059669] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-[#059669] outline-none text-slate-800 dark:text-slate-100"
                  >
                    <option value="Sightseeing">Sightseeing</option>
                    <option value="Food & Drinks">Food & Drinks</option>
                    <option value="Accommodation">Accommodation</option>
                    <option value="Transport">Transport</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Cost ($) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newCost}
                    onChange={(e) => setNewCost(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="0"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-[#059669] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-[#059669] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ActivityStatus)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-[#059669] outline-none text-slate-800 dark:text-slate-100"
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Location Name</label>
                <input
                  type="text"
                  value={newLocationName}
                  onChange={(e) => setNewLocationName(e.target.value)}
                  placeholder="e.g. Piazza del Colosseo, 1"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-[#059669] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="px-6 py-2.5 rounded-xl font-medium bg-[#059669] hover:bg-[#082D0F] text-white shadow-md transition-all disabled:opacity-50"
                >
                  {createLoading ? 'Adding...' : 'Add Activity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Компонент колонки Kanban
interface KanbanColumnProps {
  title: string;
  icon: React.ReactNode;
  count: number;
  activities: Activity[];
  onStatusChange: (id: string, status: ActivityStatus) => void;
  onDelete: (id: string) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  icon,
  count,
  activities,
  onStatusChange,
  onDelete,
}) => {
  return (
    <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/50 dark:border-slate-700/50 rounded-3xl p-5 shadow-xl flex flex-col min-h-[500px]">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="flex items-center gap-2.5 font-bold text-lg">
          {icon}
          <span>{title}</span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-200/60 dark:bg-slate-800/80">
          {count}
        </span>
      </div>

      <div className="space-y-4 flex-1">
        {activities.length === 0 ? (
          <div className="text-center py-10 text-slate-400 dark:text-slate-500 text-sm">
            No items in {title.toLowerCase()}
          </div>
        ) : (
          activities.map((item) => (
            <div
              key={item._id}
              className="bg-white/70 dark:bg-slate-800/70 border border-white/60 dark:border-slate-700/60 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100">{item.title}</h4>
                  <span className="inline-block px-2 py-0.5 mt-1 rounded-md text-[10px] font-medium bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                    {item.category}
                  </span>
                </div>
                <button
                  onClick={() => onDelete(item._id)}
                  className="text-slate-400 hover:text-red-500 p-1 rounded-md transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {item.location?.name && (
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="line-clamp-1">{item.location.name}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3">
                <span>{new Date(item.date).toLocaleDateString()}</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  ${item.cost}
                </span>
              </div>

              {/* Селект переключения статуса */}
              <div className="pt-3 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between text-xs">
                <span className="text-slate-400">Move to:</span>
                <select
                  value={item.status}
                  onChange={(e) =>
                    onStatusChange(item._id, e.target.value as ActivityStatus)
                  }
                  className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg px-2 py-1 outline-none font-medium text-xs cursor-pointer"
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};