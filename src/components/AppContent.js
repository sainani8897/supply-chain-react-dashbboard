import React, { Suspense } from "react";
import { Navigate, Route, Routes,Link } from "react-router-dom";
import { CContainer, CSpinner } from "@coreui/react";
import useAuth from "../hooks/useAuth";

// routes config
import routes from "../routes";
const AppContent = () => {
  const { auth } = useAuth(); //Getting User Info
  const permissions = auth?.auth?.permissions;
  const Page403 = React.lazy(() => import("../../src/views/pages/page403/Page403"));

  return (
    <CContainer lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={
                    route?.noPermissinRequired ||
                    permissions.some((x) =>
                      route?.canPermissions?.includes(x)
                    ) ? (
                      <route.element />
                    ) : (
                      <Navigate to="/403" replace={true} />
                    )
                  }
                />
              )
            );
          })}
          <Route path="/" element={<Navigate to="dashboard" replace />} />
          <Route path="*" element={<Navigate to="404" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  );
};

export default React.memo(AppContent);
