import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "@/domains/auth/login/slices/auth.slice";
import plansReducer from "@/domains/portal/plans/slices/plansSlice";
import { authApi } from "@/domains/auth/login/apis/login.api";
import { dashboardApi } from "@/domains/portal/dashboard/apis/dashboard.api";
import { organizationApi } from "@/domains/portal/organizations/apis/organization.api";
import { subscriptionApi } from "@/domains/portal/subscriptions/apis/subscription.api";
import { plansApi } from "@/domains/portal/plans/apis/plans.api";
import { userApi } from "@/domains/portal/users/apis/user.api";
import { paymentGatewayApi } from "@/domains/portal/payment-gateways/apis/payment-gateway.api";
import { supportTicketApi } from "@/domains/portal/support-tickets/apis/support-ticket.api";
import { notificationApi } from "@/domains/portal/notifications/apis/notification.api";
import { settingsApi } from "@/domains/portal/settings/apis/settings.api";
import { hrTemplateApi } from "@/domains/portal/hr-templates/apis/hr-template.api";

export const store = configureStore({
    reducer: {
      auth: authReducer,
      plans: plansReducer,
      
      [authApi.reducerPath]: authApi.reducer,
      [dashboardApi.reducerPath]: dashboardApi.reducer,
      [organizationApi.reducerPath]: organizationApi.reducer,
      [subscriptionApi.reducerPath]: subscriptionApi.reducer,
      [plansApi.reducerPath]: plansApi.reducer,
      [userApi.reducerPath]: userApi.reducer,
      [paymentGatewayApi.reducerPath]: paymentGatewayApi.reducer,
      [supportTicketApi.reducerPath]: supportTicketApi.reducer,
      [notificationApi.reducerPath]: notificationApi.reducer,
      [settingsApi.reducerPath]: settingsApi.reducer,
      [hrTemplateApi.reducerPath]: hrTemplateApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(authApi.middleware)
        .concat(dashboardApi.middleware)
        .concat(organizationApi.middleware)
        .concat(subscriptionApi.middleware)
        .concat(plansApi.middleware)
        .concat(userApi.middleware)
        .concat(paymentGatewayApi.middleware)
        .concat(supportTicketApi.middleware)
        .concat(notificationApi.middleware)
        .concat(settingsApi.middleware)
        .concat(hrTemplateApi.middleware)
        ,
  });

// Enable refetchOnFocus and refetchOnReconnect behaviors
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;