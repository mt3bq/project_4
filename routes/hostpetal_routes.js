const express =require('express');
const connect=require('../db')
var oc = require('orthanc-client');
const hos_controller=require('../controllers/hos_controllers');
const session= require('express-session');
const MySQLStore = require("express-mysql-session")(session);
const upload = require('express-fileupload');



const routes =express.Router();

//start session middleware


routes.get('/login',hos_controller.login_get);

routes.post('/login',hos_controller.login_post);



//routes.get('/cp',hos_controller.cp_get);

//routes.post('/cp',hos_controller.cp_post);


//end session-mysql
//index

routes.get('/index',hos_controller.cheek,hos_controller.index);

//add health
routes.get('/HealthPractitioner',hos_controller.cheek,hos_controller.HealthPractitioner_get)

//post add health
routes.post('/HealthPractitioner',hos_controller.cheek,hos_controller.HealthPractitioner_post)




//clinics




routes.get('/clinics',hos_controller.cheek,hos_controller.clinics_get);


  //Radiology start

 

  routes.get('/Radiology',hos_controller.cheek,hos_controller.Radiology_get)
  






        
        routes.post('/Radiology',hos_controller.cheek,hos_controller.Radiology_post)
      //
     

      //page of x_ray_employ

      routes.get('/index_x_ray',hos_controller.cheek,hos_controller.x_ray_index);
      

      routes.get('/x_ray_order',hos_controller.cheek,hos_controller.x_ray_order_get);

      routes.get('/x_ray_order',hos_controller.cheek,hos_controller.x_ray_order_post);



      //page of dr 

      
      routes.get('/index_dr',hos_controller.cheek,hos_controller.index_dr);

      routes.get('/Radiology_dr',hos_controller.cheek,hos_controller.Radiology_dr_get);


      routes.post('/Radiology_dr',hos_controller.cheek,hos_controller.Radiology_dr_post);
      routes.get('/logout',hos_controller.log_out);


      routes.get('/search',hos_controller.search_get);


      //routes.get('/x_ray_order_edit:id',hos_controller.x_ray_order_edit_get);
     // routes.post('/x_ray_order_edit:id',hos_controller.x_ray_order_edit_post);



      //
    
   
   

      




  module.exports=routes;