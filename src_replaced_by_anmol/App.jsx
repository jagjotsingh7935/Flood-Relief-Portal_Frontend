import AffectedVillagesMap from "./components/map/AffectedVillagesMap";
import FloodDamageSurveyForm from "./components/map/FloodDamageSurveyForm";
import FloodDashboard from "./components/sidebar/sidebar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ThemeProvider from "./theme/theme-provider";
import FloodDamageUserSurveyForm from "./components/user/FloodDamageUserSurveyForm";
import FloodTable from "./components/responses/responses";
import RequestManagementTable from "./components/requests/requests";
import UserFloodMap from "./components/usermapview/usermapview";
import LoginPage from "./components/login/login";
import PinCodeDataComponentAdmin from "./components/addmapdata-admin/PinCodeDataComponentAdmin";
import UserHomePage from "./components/userhomepage/userHomePage";
import FloodDashboardMap from "./components/user/FloodDashboardMap";
import AdminList from "./components/admin-register/AdminList";
import AdminForm from "./components/admin-register/AdminForm";
import ExcelUploadDownload from "./excel-bulk-upload/bulk-upload";
import FarmerAmountTable from "./components/amount/FarmerAmountTable";
import FarmerAmountUpdateScreen from "./components/amount/FarmerAmountUpdateScreen";
import ProtectedRoute from "./utils/PrivateRoutes";
import TotalFarmers from "./components/user/TotalFarmers";
import AddLocationData from "./addlocationdata/AddLocationData";
import AffectedAreasStats from "./components/user/AffectedAreasStats";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/affectedvillages/admin"
            element={
              <FloodDashboard showDrawer={false}>
                <AffectedVillagesMap />
              </FloodDashboard>
            }
          />

         
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/surveyform"
            element={
              <ProtectedRoute>
                <FloodDashboard showDrawer={true}>
                  <FloodDamageSurveyForm />
                </FloodDashboard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/addlocationdata"
            element={
              <ProtectedRoute>
                <FloodDashboard showDrawer={true}>
                  <AddLocationData />
                </FloodDashboard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/responses"
            element={
              <ProtectedRoute>
                <FloodDashboard showDrawer={true}>
                  <FloodTable />
                </FloodDashboard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/requests"
            element={
              <ProtectedRoute>
                <FloodDashboard showDrawer={true}>
                  <RequestManagementTable />
                </FloodDashboard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/pincodeadddataadmin"
            element={
              <ProtectedRoute>
                <FloodDashboard showDrawer={true}>
                  <PinCodeDataComponentAdmin />
                </FloodDashboard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/bulkupload"
            element={
              <ProtectedRoute>
                <FloodDashboard showDrawer={true}>
                  <ExcelUploadDownload />
                </FloodDashboard>
              </ProtectedRoute>
            }
          />

          {/* USER ROUTES */}
          <Route
            path="/floodmapview"
            element={
              <FloodDashboard showDrawer={false}>
                <UserFloodMap />
              </FloodDashboard>
            }
          />
 <Route
            path="/totalfarmers"
            element={
             
                <TotalFarmers />
             
            }
          />

           <Route
            path="/affectedareasstats"
            element={
             
                <AffectedAreasStats/>
             
            }
          />
          <Route
            path="/usersurveyform"
            element={<FloodDamageUserSurveyForm />}
          />

          <Route path="/userpage" element={<UserHomePage />} />

          <Route path="/" element={<FloodDashboardMap />} />

          <Route
            path="/admin/list"
            element={
              <ProtectedRoute>
                <FloodDashboard showDrawer={true}>
                  <AdminList />
                </FloodDashboard>
              </ProtectedRoute>
            }
          />

          <Route
            path="/amount"
            element={
              <ProtectedRoute>
                <FloodDashboard showDrawer={true}>
                  <FarmerAmountTable />
                </FloodDashboard>
              </ProtectedRoute>
            }
          />

          <Route
            path="/amount/person/:id/"
            element={
              <ProtectedRoute>
                {" "}
                <FloodDashboard showDrawer={true}>
                  <FarmerAmountUpdateScreen />
                </FloodDashboard>
              </ProtectedRoute>
            }
          />

          <Route path="/admin/form" element={<AdminForm />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

// import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
// import AffectedVillagesMap from './components/map/AffectedVillagesMap';
// import FloodDamageSurveyForm from './components/map/FloodDamageSurveyForm';
// import FloodDashboard from './components/sidebar/sidebar';
// import ThemeProvider from './theme/theme-provider';
// import FloodDamageUserSurveyForm from './components/user/FloodDamageUserSurveyForm';
// import FloodTable from './components/responses/responses';
// import RequestManagementTable from './components/requests/requests';
// import UserFloodMap from './components/usermapview/usermapview';
// import LoginPage from './components/login/login';
// import ProtectedRoute from './utils/PrivateRoutes';
// import { AuthProvider } from './auth-context/AuthProvider';

// function AppContent() {

//   return (
//     <>
//       <ThemeProvider>
//           <Routes>
//             <Route
//               path="/"
//               element={
//                 <FloodDashboard showDrawer={false}>
//                   <AffectedVillagesMap />
//                 </FloodDashboard>
//               }
//             />
//             <Route path="/login" element={<LoginPage />} />
//             <Route
//               path="/surveyform"
//               element={
//                 <ProtectedRoute>
//                   <FloodDashboard showDrawer={true}>
//                     <FloodDamageSurveyForm />
//                   </FloodDashboard>
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/responses"
//               element={
//                 <ProtectedRoute>
//                   <FloodDashboard showDrawer={true}>
//                     <FloodTable />
//                   </FloodDashboard>
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/requests"
//               element={
//                 <ProtectedRoute>
//                   <FloodDashboard showDrawer={true}>
//                     <RequestManagementTable />
//                   </FloodDashboard>
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/floodmapview"
//               element={
//                 <FloodDashboard showDrawer={false}>
//                   <UserFloodMap />
//                 </FloodDashboard>
//               }
//             />
//             <Route
//               path="/usersurveyform"
//               element={<FloodDamageUserSurveyForm />}
//             />
//           </Routes>
//       </ThemeProvider>
//     </>
//   );
// }

// export default function App() {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <AppContent />
//       </BrowserRouter>
//     </AuthProvider>
//   );
// }
