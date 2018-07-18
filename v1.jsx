p = app.project.activeItem;

// LE SCRIPT UI

var w = new Window ("palette");
w.alignChildren = "fill";

// création du controlleur
var p1 = w.add ("panel");
p1.alignChildren = "fill";
p1.add ("statictext", undefined, "Etape 1");
var btn1 = p1.add ("button", undefined, "Créer le controlleur", {name:"OK"});
btn1.onClick = function(){createControler();}

// Paramétrage des calques sélectionnés
var p2 = w.add ("panel");
p2.alignChildren = "fill";
p2.add ("statictext", undefined, "Etape 2");
var btn2 = p2.add ("button", undefined, "Paramétrer les calques sélectionnés (avec échelle)", {name:"OK"});
btn2.onClick = function(){layerParam(true);}
var btn3 = p2.add ("button", undefined, "Paramétrer les calques sélectionnés (sans échelle)", {name:"OK"});
btn3.onClick = function(){layerParam(false);}
var btn4 = p2.add ("button", undefined, "Paramétrer les échelles uniquement", {name:"OK"});
btn4.onClick = function(){layerScale();}

// Paramétrage des yeux et des oreilles
var p3 = w.add ("panel");
p3.alignChildren = "fill";
p3.add ("statictext", undefined, "Etape 2-bis");
var btn1 = p3.add ("button", undefined, "Paramétrer symétriquement", {name:"OK"});
btn1.onClick = function(){duplicator();}

w.show ( );

// LES FONCTIONS

// création du controleur
function createControler(){
    p.layers.addNull();
    control = p.layer(1)
    control.name = "CONTROL";
    control.property("ADBE Transform Group").property("ADBE Anchor Point").setValue([50,50]);

    xControl = control.property("ADBE Effect Parade").addProperty("ADBE Slider Control");
    xControl.name = "x";
    yControl = control.property("ADBE Effect Parade").addProperty("ADBE Slider Control");
    yControl.name = "y";

    xControl = control.property("ADBE Effect Parade").property("x");
    yControl = control.property("ADBE Effect Parade").property("y");
    xControl.property("ADBE Slider Control-0001").expression = "transform.position[0]/"+app.project.activeItem.width/25;
    yControl.property("ADBE Slider Control-0001").expression = "transform.position[1]/"+app.project.activeItem.width/25;
    }

// paramétrage des échelles
function layerScale(){
    for(var i = 1; i <= p.numLayers; i++){
        if(p.layer(i).selected == true){
            selLayer = p.layer(i);
            selLayer.property("ADBE Transform Group").property("ADBE Scale").expression = "x=value[0];\ny=value[1];\nif(thisComp.layer(\"CONTROL\").effect(\"x\")(\"Slider\")>12.5)\n{x=-x;}\n[x,y]";
            
            xPos = selLayer.property("ADBE Transform Group").property("ADBE Position");
            xDif = p.width/2 - xPos.value[0];
            xPos.setValue([xPos.value[0]+xDif, xPos.value[1], xPos.value[2]]);

            aPos = selLayer.property("ADBE Transform Group").property("ADBE Anchor Point");
            aPos.setValue([aPos.value[0]+xDif, aPos.value[1], aPos.value[2]]);
            }
        }
    }

// paramétrage des calques sélectionnés
function layerParam(scaleVerif){
    for(var i = 1; i <= p.numLayers; i++){
        if(p.layer(i).selected == true){
            selLayer = p.layer(i);

            if(scaleVerif == true){
                selLayer.property("ADBE Transform Group").property("ADBE Scale").expression = "x=value[0];\ny=value[1];\nif(thisComp.layer(\"CONTROL\").effect(\"x\")(\"Slider\")>12.5)\n{x=-x;}\n[x,y]";   
                
                xPos = selLayer.property("ADBE Transform Group").property("ADBE Position");
                xDif = p.width/2 - xPos.value[0];
                xPos.setValue([xPos.value[0]+xDif, xPos.value[1], xPos.value[2]]);

                aPos = selLayer.property("ADBE Transform Group").property("ADBE Anchor Point");
                aPos.setValue([aPos.value[0]+xDif, aPos.value[1], aPos.value[2]]);
                }
            
            xPos = selLayer.property("ADBE Effect Parade").addProperty("ADBE Slider Control");
            xPos.name = "xPos";
            yPos = selLayer.property("ADBE Effect Parade").addProperty("ADBE Slider Control");
            yPos.name = "yPos";
            
            xVal = selLayer.property("ADBE Transform Group").property("ADBE Position").value[0];
            xPos = selLayer.property("ADBE Effect Parade").property("xPos");
            xPos.property("ADBE Slider Control-0001").setValue(xVal);
            
            yVal = selLayer.property("ADBE Transform Group").property("ADBE Position").value[1];
            yPos = selLayer.property("ADBE Effect Parade").property("yPos");
            yPos.property("ADBE Slider Control-0001").setValue(yVal);
            
            xPos.property("ADBE Slider Control-0001").setValueAtTime(0,xVal);
            xPos.property("ADBE Slider Control-0001").setValueAtTime(0.5,xVal);
            xPos.property("ADBE Slider Control-0001").setValueAtTime(1,xVal);
            
            yPos.property("ADBE Slider Control-0001").setValueAtTime(0,yVal);
            yPos.property("ADBE Slider Control-0001").setValueAtTime(0.5,yVal);
            yPos.property("ADBE Slider Control-0001").setValueAtTime(1,yVal);
            
            xMorph = selLayer.property("ADBE Effect Parade").addProperty("ADBE Slider Control");
            xMorph.name = "xMorph";
            yMorph = selLayer.property("ADBE Effect Parade").addProperty("ADBE Slider Control");
            yMorph.name = "yMorph";
            
            xMorph = selLayer.property("ADBE Effect Parade").property("xMorph");
            xMorph.property("ADBE Slider Control-0001").expression = "effect(\"xPos\")(\"Slider\").valueAtTime((thisComp.layer(\"CONTROL\").effect(\"x\")(\"Slider\")-thisComp.displayStartTime/thisComp.frameDuration)*thisComp.frameDuration)";
            yMorph = selLayer.property("ADBE Effect Parade").property("yMorph");
            yMorph.property("ADBE Slider Control-0001").expression = "effect(\"yPos\")(\"Slider\").valueAtTime((thisComp.layer(\"CONTROL\").effect(\"y\")(\"Slider\")-thisComp.displayStartTime/thisComp.frameDuration)*thisComp.frameDuration)";
            
            selLayer.property("ADBE Transform Group").property("ADBE Position").expression = "x=effect(\"xMorph\")(\"Slider\");\ny=effect(\"yMorph\")(\"Slider\");\n[x,y]";
            if(selLayer.name == "oreille G"){
                selLayer.property("ADBE Effect Parade").property("ADBE Set Matte3").property("ADBE Effect Built In Params").property("ADBE Effect Mask Opacity").expression = "val = value;\nif(thisComp.layer(\"CONTROL\").effect(\"x\")(\"Slider\") < 12.5){\nval = 0;\n}\nval";
                }
            if(selLayer.name == "oreille D"){
                selLayer.property("ADBE Effect Parade").property("ADBE Set Matte3").property("ADBE Effect Built In Params").property("ADBE Effect Mask Opacity").expression = "val = value;\nif(thisComp.layer(\"CONTROL\").effect(\"x\")(\"Slider\") > 12.5){\nval = 0;\n}\nval";
                }
            }
        }
    }

// Paramétrage symétrique
function duplicator(){
    u = 0;
     for(var i = 1; i <= p.numLayers; i++){
        if(p.layer(i).selected == true){
            selLayer = p.layer(i);
            layerName = selLayer.name.replace(" G", "");
            layerName = layerName.replace(" D", "");
            layerNameG = layerName + " G";
            layerNameD = layerName + " D";
            tabLayer[u++] = [p.layer(layerNameG), p.layer(layerNameD), layerName];
            }
        }
    for(i=0; i< tabLayer.length; i++){
        // on check lequel des deux est paramétré, alors on définit le référent et la cible
        if(
        tabLayer[i][0].property("ADBE Effect Parade").property("ADBE Slider Control") != null || 
        tabLayer[i][1].property("ADBE Effect Parade").property("ADBE Slider Control") != null){
            if(tabLayer[i][0].property("ADBE Effect Parade").property("ADBE Slider Control") != null){
                layerRef = tabLayer[i][0];
                layerSet = tabLayer[i][1];
                }
            else {
                layerRef = tabLayer[i][1];
                layerSet = tabLayer[i][0];
                }
            // on crée les expression controls pour la cible
            xPos = layerSet.property("ADBE Effect Parade").addProperty("ADBE Slider Control");
            xPos.name = "xPos";
            yPos = layerSet.property("ADBE Effect Parade").addProperty("ADBE Slider Control");
            yPos.name = "yPos";
            
            // on enregistre les valeurs du référent
            xRef1 = layerRef.property("ADBE Effect Parade").property("xPos").property("ADBE Slider Control-0001").valueAtTime(0, true);
            xRef2 = layerRef.property("ADBE Effect Parade").property("xPos").property("ADBE Slider Control-0001").valueAtTime(0.5, true);
            xRef3 = layerRef.property("ADBE Effect Parade").property("xPos").property("ADBE Slider Control-0001").valueAtTime(1, true);
            
            xAdd1 = xRef1 - xRef2;
            xAdd2 = xRef3 - xRef2;
            
            // on applique le système de valeur de position à la cible
            xVal = layerSet.property("ADBE Transform Group").property("ADBE Position").value[0];
            xPos = layerSet.property("ADBE Effect Parade").property("xPos");
            xPos.property("ADBE Slider Control-0001").setValue(xVal);
            
            xPos.property("ADBE Slider Control-0001").expression = "valueAtTime((thisComp.layer(\"CONTROL\").effect(\"x\")(\"Slider\")-thisComp.displayStartTime/thisComp.frameDuration)*thisComp.frameDuration)";
            xPos.property("ADBE Slider Control-0001").setValueAtTime(0,xVal - xAdd2);
            xPos.property("ADBE Slider Control-0001").setValueAtTime(0.5,xVal);
            xPos.property("ADBE Slider Control-0001").setValueAtTime(1,xVal - xAdd1);
                    
            yRef1 = layerRef.property("ADBE Effect Parade").property("yPos").property("ADBE Slider Control-0001").valueAtTime(0, true);
            yRef2 = layerRef.property("ADBE Effect Parade").property("yPos").property("ADBE Slider Control-0001").valueAtTime(0.5, true);
            yRef3 = layerRef.property("ADBE Effect Parade").property("yPos").property("ADBE Slider Control-0001").valueAtTime(1, true);
                    
            yPos = layerSet.property("ADBE Effect Parade").property("yPos");
            yPos.property("ADBE Slider Control-0001").expression = "valueAtTime((thisComp.layer(\"CONTROL\").effect(\"y\")(\"Slider\")-thisComp.displayStartTime/thisComp.frameDuration)*thisComp.frameDuration)";
            yPos.property("ADBE Slider Control-0001").setValueAtTime(0,yRef1);
            yPos.property("ADBE Slider Control-0001").setValueAtTime(0.5,yRef2);
            yPos.property("ADBE Slider Control-0001").setValueAtTime(1,yRef3);
                    
            layerSet.property("ADBE Transform Group").property("ADBE Position").expression = "x=effect(\"xPos\")(\"Slider\");\ny=effect(\"yPos\")(\"Slider\");\n[x,y]";

            if(layerSet.name == "oreille G"){
                layerSet.property("ADBE Effect Parade").property("ADBE Set Matte3").property("ADBE Effect Built In Params").property("ADBE Effect Mask Opacity").expression = "val = value;\nif(thisComp.layer(\"CONTROL\").effect(\"x\")(\"Slider\") < 12.5){\nval = 0;\n}\nval";
                }
            if(layerSet.name == "oreille D"){
                layerSet.property("ADBE Effect Parade").property("ADBE Set Matte3").property("ADBE Effect Built In Params").property("ADBE Effect Mask Opacity").expression = "val = value;\nif(thisComp.layer(\"CONTROL\").effect(\"x\")(\"Slider\") > 12.5){\nval = 0;\n}\nval";
                }
            }
        else {alert("Aucun calque " + tabLayer[i][2] + " paramétré.");}
        }
    }
