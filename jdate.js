console.log(shamsiNow());
function shamsiNow(){
  var date = new Date();
  return gregorian_to_jalali(date.getYear()+1900,date.getMonth()+1,date.getDate());
}
function gregorian_to_jalali (g_y,g_m,g_d,mod/*''*/){
  if(typeof mod === "undefined"){
    mod = '';
  }

  var d_4=g_y%4;
  var g_a={0 : 0,1 : 0,2 : 31,3 : 59,4 : 90,5 : 120,6 : 151,7 : 181,8 : 212,9 : 243,10 : 273,11 : 304,12 : 334};
  var doy_g=g_a[parseInt(g_m)]+g_d;
  if(d_4==0 && g_m>2){
    doy_g++;
  }
  var d_33=parseInt((((g_y-16)%132)*0.0305));
  var a=(d_33==3 || d_33<(d_4-1) || d_4==0)
    ? 286
    : 287;
  var b=((d_33==1 || d_33==2) && (d_33==d_4 || d_4==1))
    ? 78
    : ((d_33==3 && d_4==0)
        ? 80
        : 79);
  if(parseInt((g_y-10)/63)==30){
    a--;
    b++;
  }
  var jy=0;
  var doy_j=0;
  if(doy_g>b){
    jy=g_y-621; 
    doy_j=doy_g-b;
  }else{
    jy=g_y-622; 
    doy_j=doy_g+a;
  }
  var jm=0;
  var jd=0;
  if(doy_j<187){
    jm=parseInt((doy_j-1)/31); 
    jd=doy_j-(31*jm++);
  }else{
    jm=parseInt((doy_j-187)/30); 
    jd=doy_j-186-(jm*30); 
    jm+=7;
  }
  var result=(mod=='')
    ?{0 : jy,1 : jm,2 : jd}
    :jy + "" + mod + "" + jm + "" + mod + "" + jd;
  return result;
}

function jalali_to_gregorian (j_y,j_m,j_d,mod/*''*/){
  if(typeof mod === "undefined"){
    mod = '';
  }

  var d_4=(j_y+1)%4;
  var doy_j=(j_m<7)
    ?((j_m-1)*31)+j_d
    :((j_m-7)*30)+j_d+186;
  var d_33=parseInt(((j_y-55)%132)*0.0305);
  var a=(d_33!=3 && d_4<=d_33)
    ? 287
    : 286;
  var b_=((d_33==3 && d_4==0))
    ? 80
    : 79;
  var b=((d_33==1 || d_33==2) && (d_33==d_4 || d_4==1))
    ? 78
    : b_;
  if(parseInt((j_y-19)/63)==20){
    a--;
    b++;
  }
  var gy=0;
  var gd=0;
  if(doy_j<=a){
    gy=j_y+621; 
    gd=doy_j+b;
  }else{
    gy=j_y+622; 
    gd=doy_j-a;
  }
  var gy_=(gy%4==0)
    ? 29
    : 28;
  var gy_array=[0,31,gy_,31,30,31,30,31,31,30,31,30,31];
  var gm=0;
  for (gm in gy_array) {
    var v = gy_array[gm];
    if(gd<=v){
      break;
    }
    gd-=v;
  }
  var result=(mod=='')
    ? {0 : gy,1 : gm,2 : gd}
    : gy + "" + mod + "" + gm + "" + mod + "" + gd;
  return result;
}                 
