import React from 'react';
import { useAuthStore } from '@/provider/store/authStore';
import { useUserStore } from '@/provider/store/userStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Lock, Unlock } from 'lucide-react';

/**
 * RouteProtectionStatus Component
 * 
 * A debug component to show current authentication status and route access
 * Place this in your layout or page to see authentication status
 * 
 * Usage:
 * import RouteProtectionStatus from '@/components/RouteProtectionStatus';
 * 
 * <RouteProtectionStatus />
 */

const RouteProtectionStatus: React.FC = () => {
  const { auth, isAuth } = useAuthStore();
  const { user } = useUserStore();

  // Define route access by role
  const routeAccess = {
    public: ["/", "/services", "/aesthetician", "/branches", "/about-us"],
    customer: ["/customer/dashboard", "/customer/profile", "/customer/history"],
    admin: [
      "/manage/appointments",
      "/manage/customer",
      "/manage/aesthetician",
      "/manage/service",
      "/manage/voucher",
      "/manage/profile",
    ],
    owner: [
      "/manage/dashboard/appointments",
      "/manage/dashboard/sales",
      "/manage/branch",
      "/manage/admin",
      "/manage/settings",
    ],
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-purple-500';
      case 'admin':
        return 'bg-blue-500';
      case 'customer':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getAccessibleRoutes = () => {
    if (!auth?.role) return routeAccess.public;

    switch (auth.role) {
      case 'owner':
        return [
          ...routeAccess.public,
          ...routeAccess.customer,
          ...routeAccess.admin,
          ...routeAccess.owner,
        ];
      case 'admin':
        return [...routeAccess.public, ...routeAccess.customer, ...routeAccess.admin];
      case 'customer':
        return [...routeAccess.public, ...routeAccess.customer];
      default:
        return routeAccess.public;
    }
  };

  const accessibleRoutes = getAccessibleRoutes();

  return (
    <Card className="w-full max-w-2xl mx-auto my-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isAuth ? (
            <>
              <Unlock className="h-5 w-5 text-green-500" />
              Route Protection Status - Authenticated
            </>
          ) : (
            <>
              <Lock className="h-5 w-5 text-red-500" />
              Route Protection Status - Not Authenticated
            </>
          )}
        </CardTitle>
        <CardDescription>
          Current authentication status and accessible routes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Authentication Status */}
        <div className="space-y-2">
          <h3 className="font-semibold">Authentication Status</h3>
          <div className="flex items-center gap-2">
            {isAuth ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            <span className="text-sm">
              {isAuth ? 'Authenticated' : 'Not Authenticated'}
            </span>
          </div>
        </div>

        {/* User Info */}
        {auth && user && (
          <div className="space-y-2">
            <h3 className="font-semibold">User Information</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Name:</span>{' '}
                {user.first_name} {user.last_name}
              </div>
              <div>
                <span className="text-muted-foreground">Email:</span> {auth.email}
              </div>
              <div>
                <span className="text-muted-foreground">Role:</span>{' '}
                <Badge className={getRoleColor(auth.role)}>
                  {auth.role.toUpperCase()}
                </Badge>
              </div>
              <div>
                <span className="text-muted-foreground">Verified:</span>{' '}
                {auth.is_verified ? (
                  <Badge variant="default">Yes</Badge>
                ) : (
                  <Badge variant="destructive">No</Badge>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Accessible Routes */}
        <div className="space-y-2">
          <h3 className="font-semibold">
            Accessible Routes ({accessibleRoutes.length})
          </h3>
          <div className="max-h-48 overflow-y-auto space-y-1 border rounded-md p-2">
            {accessibleRoutes.map((route) => (
              <div
                key={route}
                className="text-xs font-mono bg-muted px-2 py-1 rounded"
              >
                {route}
              </div>
            ))}
          </div>
        </div>

        {/* Route Access Summary */}
        <div className="space-y-2">
          <h3 className="font-semibold">Route Access Summary</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Public Routes:</span>
              <span className="font-mono">{routeAccess.public.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Customer Routes:</span>
              <span className="font-mono">{routeAccess.customer.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Admin Routes:</span>
              <span className="font-mono">{routeAccess.admin.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Owner Routes:</span>
              <span className="font-mono">{routeAccess.owner.length}</span>
            </div>
          </div>
        </div>

        {/* Warning */}
        {!isAuth && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <p className="text-sm text-yellow-800">
              ⚠️ You are not authenticated. You can only access public routes.
              Attempting to access protected routes will redirect you to the sign-in
              page.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RouteProtectionStatus;
