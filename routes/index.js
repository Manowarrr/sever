const express = require('express');
const router = express.Router();
const buildingController = require('../controllers/buildingController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const tenantController = require('../controllers/tenantController');
const contractController = require('../controllers/contractController');
const inspectionController = require('../controllers/inspectionController');

const { catchErrors } = require('../handlers/errorHandlers');

// Main page, login/register forms
router.get('/', userController.loginForm);
router.get('/register', userController.registerForm);
router.get('/login', userController.loginForm);
router.get('/logout', authController.logout);

router.post('/register', 
  userController.validateRegister,
  userController.register,
  authController.login
);

router.post('/login', authController.login);

// Users
router.get('/users', 
  authController.isLoggedIn,
  catchErrors(userController.getUsers)
);

// Inspections
router.get('/inspections', 
  authController.isLoggedIn,
  catchErrors(inspectionController.getInspections)
);

router.get('/addInspection/:id', 
  authController.isLoggedIn,
  catchErrors(inspectionController.addInspection)
);

router.get('/inspections', 
  authController.isLoggedIn,
  catchErrors(inspectionController.getInspections)
);

router.post('/addInspection', 
  inspectionController.uploadGallery, 
  //inspectionController.uploadFiles, 
  catchErrors(inspectionController.createInspection)
);
// Buildings
router.get('/buildings', 
  authController.isLoggedIn,
  catchErrors(buildingController.getBuildingsByDistrict)
);
router.get('/buildings/districts/:district', 
  authController.isLoggedIn,
  catchErrors(buildingController.getBuildingsByDistrict)
);
router.get('/addBuilding', 
  authController.isLoggedIn,
  buildingController.addBuilding
);
router.post('/addBuilding', 
  buildingController.uploadMainPhoto, 
  catchErrors(buildingController.createBuilding)
);
router.post('/addBuilding/:id',
  buildingController.uploadMainPhoto, 
  catchErrors(buildingController.updateBuilding)
);
router.post('/addGallery/:id', 
  buildingController.uploadGallery, 
  catchErrors(buildingController.updateGallery)
);
router.post('/addFiles/:id', 
  buildingController.uploadFiles, 
  catchErrors(buildingController.updateFiles)
);
router.get('/buildings/:id/edit', 
  authController.isLoggedIn,
  catchErrors(buildingController.editBuilding)
);
router.get('/buildings/:id/delete', 
  authController.isLoggedIn,
  catchErrors(buildingController.deleteBuilding)
);
router.get('/buildings/:slug', 
  authController.isLoggedIn,
  catchErrors(buildingController.getBuildingBySlug)
);

// tenants
router.get('/tenants', 
  authController.isLoggedIn,
  catchErrors(tenantController.getTenants)
);
router.get('/addTenant', 
  authController.isLoggedIn,
  tenantController.addTenant
);
router.post('/addTenant', 
  catchErrors(tenantController.createTenant)
);
router.get('/tenants/:id/edit', 
  authController.isLoggedIn,
  catchErrors(tenantController.editTenant)
);
router.get('/tenants/:id/delete', 
  authController.isLoggedIn,
  catchErrors(tenantController.deleteTenant)
);
router.post('/addTenant/:id',
  catchErrors(tenantController.updateTenant)
);
router.get('/tenants/:slug', 
  authController.isLoggedIn,
  catchErrors(tenantController.getTenantBySlug)
);

// contracts
router.get('/contracts', 
  authController.isLoggedIn,
  catchErrors(contractController.getContracts)
);
router.post('/getContractsByDate', 
  authController.isLoggedIn,
  catchErrors(contractController.getContractsByDate)
);
router.get('/addContract/:id', 
  authController.isLoggedIn,
  catchErrors(contractController.addContract)
);
router.post('/addContract', 
  catchErrors(contractController.createContract)
);
router.get('/contracts/:id/edit', 
  authController.isLoggedIn,
  catchErrors(contractController.editContract)
);
router.get('/contracts/:id/delete', 
  authController.isLoggedIn,
  catchErrors(contractController.deleteContract)
);
router.post('/addContract/:id',
  catchErrors(contractController.updateContract)
);
router.get('/contracts/:slug', 
  authController.isLoggedIn,
  catchErrors(contractController.getContractBySlug)
);
router.post('/addContractFiles/:id', 
  contractController.uploadFiles, 
  catchErrors(contractController.updateFiles)
);
router.post('/addContractClaims/:id', 
  contractController.uploadClaims, 
  catchErrors(contractController.updateClaims)
);
// user account
router.get('/account',
  authController.isLoggedIn,
  userController.account  
);
router.post('/account',
  catchErrors(userController.updateAccount)  
);

// map
router.get('/map', catchErrors(buildingController.getBuildings));
router.get('/test', catchErrors(buildingController.generate));

// charts
 router.get('/stats', 
    authController.isLoggedIn,
    buildingController.showCharts
);

// API
router.get('/api/search', catchErrors(buildingController.search));
router.get('/api/buildings', catchErrors(buildingController.getBuildingsJson));
router.get('/api/chartDistricts', catchErrors(buildingController.chartDistricts));
router.get('/api/chartContractDistricts', catchErrors(contractController.chartContractDistricts));

router.get('/api/placeDistricts', catchErrors(contractController.placeDistricts));


module.exports = router;
