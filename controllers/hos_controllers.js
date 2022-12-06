const connect=require('../db')
var oc = require('orthanc-client');
const { render } = require('express/lib/response');
const session= require('express-session');
const MySQLStore = require("express-mysql-session")(session);
const fs=require('fs');
const upload = require('express-fileupload');
const express = require('express');
const app=express();
app.use(upload());


let client= new oc({
    url:"http://ec2-54-162-64-196.compute-1.amazonaws.com:8042",
 //   url:"http://127.0.0.1:8042",
   auth: {
       username: 'muteb',
        password: 'muteb'
      }
    
    
  
  });



const cheek=(req,res,next)=>{
    if(req.session.cheek){
       
        next();
    }else{
        res.redirect('login');
    }
}

//admin Functions Page

const index=(req,res)=>{
    
    let name=req.session.user_info;
        
    let em_type= req.session.type;
   
    
    if(em_type =='Administrative'){
        res.render('index',{name})
    }else{
        res.redirect('login');
    }
       
    
       
    
}

const log_out=(req,res)=>{
    req.session.destroy();
    res.redirect('login')
}

const HealthPractitioner_get =(req,res)=>{
    var sql='SELECT * FROM healthparactitioner;';
    connect.query(sql, function (err, data, fields) {
    if (err) throw err;
    let name=req.session.user_info;

    let em_type=  req.session.type;
    
    if(em_type=='Administrative'){
        res.render('Health Practitioner', {msg :"",user: data,name});
    }else{
        res.redirect('login');
    }
   
    
  });
}

const HealthPractitioner_post=(req,res)=>{
    let first_name=req.body.first_name;
    let se_name=req.body.se_name;
    let list_name=req.body.list_name;
    let ar_first_name=req.body.Arabic_first_name;
    let ar_se=req.body.Arabic_se_name;
    let ar_list_name=req.body.Arabic_list_name;
    let Specialization=req.body.Specialization;
    let Clinic=req.body.Clinic;
    let Role=req.body.Role;
    let momares_number=req.body.momares_number;
    let phone_number=req.body.phone_number;
    let up_sgnil=req.body.up_sgnil;
    let emaill=req.body.emaill;
    let employee_type=req.body.employee_type;
    var sql='SELECT * FROM healthparactitioner;';
    connect.query(sql, function (err, data, fields) {
    if (err) throw err;
    let sql='select * from healthparactitioner where phone_number=?';
    
    connect.query(sql,[phone_number],(er,resl)=>{
       
       
        if(!er){
           
           
            let inset_query='insert into healthparactitioner (first_name,se_name,list_name,ar_first_name,ar_se_name,ar_list_name,Specialization,Clinic,Role,Momares_number,phone_number,sig,email,user,password,employee_type)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
            if(resl.length===0){
                connect.query(inset_query,[first_name,se_name,list_name,ar_first_name,ar_se,ar_list_name,Specialization,Clinic,Role,momares_number,phone_number,up_sgnil,emaill,first_name,"123456789",employee_type],(e)=>{
                    if(!e){
                        res.status(201).json("true");
                         
                        
                    }else{
                        console.log(e);
                    }
                })
            }else{
                res.status(400).json("false");
                
            }
        }else{
            connect.log(er)
        }


    })
  });

    
}


const clinics_get=(req,res)=>{
    var sql='SELECT * FROM healthparactitioner;';
    connect.query(sql, function (err, data, fields) {
    if (err) throw err;
    let name=req.session.user_info;
    let em_type=  req.session.type;
    
    if(em_type=='Administrative'){
        res.render('clinics', {msg :"",user: data,name});
    }else{
        res.redirect('login');
    }
    
  });
}

const clinics_post=()=>{}

const Radiology_get=(req,res)=>{
    let id=req.params.id;

    let dr_name=req.session.user_info;
    var sql='SELECT * FROM x_ray_order where dr_name=?;';
    connect.query(sql,[dr_name], function (err, data, fields) {
    if (err) throw err;
    let name=req.session.user_info;
    client.studies.getAll()
        .then(function(ress) {
            let em_type= req.session.type;
   
    
            if(em_type =='Administrative'){
                res.render('Radiology', {msg :"",data,name,ress});
            }else{
                res.redirect('login');
            }
               
            
            
        })
        .catch(function(err) {
            console.log(err);
        });
          
    
  });
           
      
       
}



const Radiology_post=(req,res)=>{
    let Patients_name=req.body.Patients_name;
    let Patients_id=req.body.Patients_id;
    let x_ray_type=req.body.x_ray_type;
    let clinic_name=req.body.clinic_name;
    let dr_name=req.session.user_info;
    let phone_number=req.body.Phone_number;
    let status_info=req.body.status_info;


    let sql='insert into x_ray_order (Pation_id,Pation_name,dr_name,x_ray_type,status,Clinic_Name,Phone_number,order_status,dicom_file,dicom_id_view) values (?,?,?,?,?,?,?,?,?,?)';
    connect.query(sql,[Patients_id,Patients_name,dr_name,x_ray_type,status_info,clinic_name,phone_number,"new","",""],(e)=>{
        if(!e){
            res.status(201).json("true");
             
            
        }else{
            res.status(201).json("false");
            console.log(e);
        }
    })


}

//employee login

const login_get=(req,res)=>{

    res.render('login');

}



const login_post=(req,res)=>{

    let name=req.body.name;
    let password=req.body.password;
    let sql='select * from healthparactitioner where user= ? and password=?';


  connect.query(sql,[name,password],(e,d)=>{
      if(d.length!=0){
         //res.render('index');
         
        req.session.cheek=true;
        req.session.user_info=name;
        req.session.user=d[0].employee_type;

         

       

           let em_type=d[0].employee_type;
        
             if(em_type=='xray'){
                req.session.type=em_type;
                res.render("x_ray/index_x_ray",{data:d,name})
             }

             if(em_type=='Doctor'){
               req.session.type=em_type;
               res.render("dr/index_dr",{data:d,name})
              }
              if(em_type=='Administrative'){
                req.session.type=em_type;
                res.render('index',{data:d,name})
              }
        
       
       
            

            

        


            
       }else{
        res.redirect('login');
        
    }
       
       
         

         
         
     
  })

}



const Schedul_Timing_get=(req,res)=>{
    var sql='SELECT * FROM healthparactitioner;';
    connect.query(sql, function (err, data, fields) {
    if (err) throw err;
    let name=req.session.user_info;

    let em_type=  req.session.type;
    
    if(em_type=='Administrative'){
        res.render('Schedul_Timing', {msg :"",user: data,name});
    }else{
        res.redirect('login');
    }
   
    
  });
}

const Schedul_Timing_post=(req,res)=>{}









//Function x-ray Page
const x_ray_index=(req,res)=>{
    let name=req.session.user_info;
    let em_type=  req.session.type;
    
    if(em_type=='xray'){
        res.render('x_ray/index_x_ray.ejs',{name})
    }else{
        res.redirect('login');
    }
    
}


const x_ray_order_get=(req,res)=>{
    let sql ="select * from x_ray_order"

    connect.query(sql,(e,data)=>{
        if(!e){
            let name=req.session.user_info;
            let em_type=  req.session.type;
    
            if(em_type=='xray'){
                res.render('x_ray/x_ray_order',{data,name})
            }else{
                res.redirect('login');
            }
            
            
        }
    })
}

const x_ray_order_post=(req,res)=>{}




//Dr page funcrions

const index_dr=(req,res)=>{

    let name=req.session.user_info;
    let em_type=req.session.type;
    if(em_type=='Doctor'){
        res.render('dr/index_dr',{name});
    }else{
        res.redirect('login');
    }
   
}





const Radiology_dr_get=(req,res)=>{
    let dr_name=req.session.user_info;
    var sql='SELECT * FROM x_ray_order where dr_name="'+dr_name+'";';
    connect.query(sql, function (err, data, fields) {
    if (err) throw err;
    let name=req.session.user_info;
    client.studies.getAll()
        .then(function(ress) {

            let name=req.session.user_info;
            let em_type=req.session.type;
            if(em_type=='Doctor'){

               

                
                
                   
                res.render('dr/Radiology_dr',{msg :"",data,name,ress});

          
            }else{
                res.redirect('login');
            }
           
            
            
            
            
        })
        .catch(function(err) {
            console.log(err)
             
        });
          
    
  });
}

const search_get=(req,res)=>{

    let ser_id=req.query.ser_id;
    

    let sql_sear="SELECT * FROM x_ray_order where Pation_id LIKE ? ";
    connect.query(sql_sear,[`%${ser_id}`],function(er,data){
        let name=req.session.user_info;
        let em_type=req.session.type;
        
      
        if(!er){
           
            if(em_type=='Doctor'){
                res.render('dr/Radiology_dr',{data,name});
            }
            if(em_type=='Administrative'){
                res.render('Radiology',{data,name});
            }else{
                res.redirect('login');
            }
           

            
        }else{
            console.log(er)
        }
        
})

}
const Radiology_dr_post=(req,res)=>{
    let Patients_name=req.body.Patients_name;
    let Patients_id=req.body.Patients_id;
    let x_ray_type=req.body.x_ray_type;
    let clinic_name=req.body.clinic_name;
    let dr_name=req.session.user_info;
    let phone_number=req.body.Phone_number;
    let status_info=req.body.status_info;


    let sql='insert into x_ray_order (Pation_id,Pation_name,dr_name,x_ray_type,status,Clinic_Name,Phone_number,order_status,dicom_file,dicom_id_view) values (?,?,?,?,?,?,?,?,?,?)';
    connect.query(sql,[Patients_id,Patients_name,dr_name,x_ray_type,status_info,clinic_name,phone_number,"new","",""],(e)=>{
        if(!e){
            res.status(201).json("true");
             
            
        }else{
            res.status(201).json("false");
            console.log(e);
        }
    })

}







module.exports={
    HealthPractitioner_get,
    HealthPractitioner_post,
    clinics_get,
    clinics_post,
    Radiology_get,
    Radiology_post,
    login_get,
    login_post ,
    
    cheek,
    index,
    x_ray_index,
    x_ray_order_get,
    x_ray_order_post,
    Schedul_Timing_get,
    Radiology_dr_get,
    Radiology_dr_post,
    index_dr,
    search_get,
    log_out
    
   // x_ray_order_edit_get,
    //x_ray_order_edit_post
}
