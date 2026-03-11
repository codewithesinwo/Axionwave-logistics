import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ShipmentTable } from '@/components/shipment-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { LogOut, Truck, Package, CheckCircle, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

interface Shipment {
  id: string;
  user_id: string;
  tracking_number: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'cancelled';
  amount: number;
  origin_address: string;
  destination_address: string;
  recipient_name: string;
  recipient_email?: string;
  created_at: string;
  delivered_at?: string;
}

interface UserProfile {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

export default function AdminPage() {
  const router = useRouter();
  const supabase = createClient();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
          router.push('/login');
          return;
        }

        // Get user profile to check if admin
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError || !profile || profile.role !== 'admin') {
          toast.error('Unauthorized: Admin access only');
          router.push('/dashboard');
          return;
        }

        setUserProfile(profile);

        // Fetch all shipments for admin
        const { data: shipmentsData, error: shipmentsError } = await supabase
          .from('shipments')
          .select('*')
          .order('created_at', { ascending: false });

        if (shipmentsError) {
          console.error('[v0] Error fetching shipments:', shipmentsError);
          toast.error('Failed to load shipments');
          return;
        }

        setShipments(shipmentsData || []);
      } catch (err) {
        console.error('[v0] Error:', err);
        toast.error('An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router, supabase]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Failed to logout');
    } else {
      router.push('/login');
    }
  };

  // Filter shipments
  const filteredShipments = shipments.filter(shipment => {
    const matchesStatus = statusFilter === 'all' || shipment.status === statusFilter;
    const matchesSearch =
      shipment.tracking_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.recipient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.origin_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.destination_address.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return null;
  }

  // Calculate statistics
  const totalShipments = shipments.length;
  const inTransit = shipments.filter(s => s.status === 'in_transit').length;
  const delivered = shipments.filter(s => s.status === 'delivered').length;
  const totalAmount = shipments.reduce((sum, s) => sum + (s.amount || 0), 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome, {userProfile?.email}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Shipments</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalShipments}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Transit</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inTransit}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Delivered</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{delivered}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalAmount.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="search" className="text-sm font-medium mb-2 block">
              Search
            </label>
            <Input
              id="search"
              placeholder="Search by tracking, recipient, address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="status" className="text-sm font-medium mb-2 block">
              Filter by Status
            </label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Shipments Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Shipments</CardTitle>
            <CardDescription>
              Showing {filteredShipments.length} of {totalShipments} shipments
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredShipments.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">No shipments found</p>
              </div>
            ) : (
              <ShipmentTable shipments={filteredShipments} isAdmin={true} />
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
