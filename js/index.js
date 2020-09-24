


window.onload = () => {
    
}

var map;
var markers = [];
var infoWindow;

function initMap() {

    var styledMapType = new google.maps.StyledMapType(
        [
          {elementType: 'geometry', stylers: [{color: '#ebe3cd'}]},
          {elementType: 'labels.text.fill', stylers: [{color: '#523735'}]},
          {elementType: 'labels.text.stroke', stylers: [{color: '#f5f1e6'}]},
          {
            featureType: 'administrative',
            elementType: 'geometry.stroke',
            stylers: [{color: '#EE905F'}]
          },
          {
            featureType: 'administrative.land_parcel',
            elementType: 'geometry.stroke',
            stylers: [{color: '#FEE3AD'}]
          },
          {
            featureType: 'administrative.land_parcel',
            elementType: 'labels.text.fill',
            stylers: [{color: '#ae9e90'}]
          },
          {
            featureType: 'landscape.natural',
            elementType: 'geometry',
            stylers: [{color: '#F8EFC4'}]
          },
          {
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [{color: '#dfd2ae'}]
          },
          {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{color: '#black'}]
          },
          {
            featureType: 'poi.park',
            elementType: 'geometry.fill',
            stylers: [{color: '#84E68A'}]
          },
          {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [{color: '#447530'}]
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{color: 'E8F7F8'}]
          },
          {
            featureType: 'road.arterial',
            elementType: 'geometry',
            stylers: [{color: '#fdfcf8'}]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{color: '#CFFF71'}]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{color: '#e9bc62'}]
          },
          {
            featureType: 'road.highway.controlled_access',
            elementType: 'geometry',
            stylers: [{color: '#FDDF5A'}]
          },
          {
            featureType: 'road.highway.controlled_access',
            elementType: 'geometry.stroke',
            stylers: [{color: '#F7E962'}]
          },
          {
            featureType: 'road.local',
            elementType: 'labels.text.fill',
            stylers: [{color: '#806b63'}]
          },
          {
            featureType: 'transit.line',
            elementType: 'geometry',
            stylers: [{color: '#dfd2ae'}]
          },
          {
            featureType: 'transit.line',
            elementType: 'labels.text.fill',
            stylers: [{color: '#8f7d77'}]
          },
          {
            featureType: 'transit.line',
            elementType: 'labels.text.stroke',
            stylers: [{color: '#ebe3cd'}]
          },
          {
            featureType: 'transit.station',
            elementType: 'geometry',
            stylers: [{color: '#dfd2ae'}]
          },
          {
            featureType: 'water',
            elementType: 'geometry.fill',
            stylers: [{color: '#A7E4E9'}]
          },
          {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{color: 'black'}]
          }
        ],
        {name: 'Styled Map'});


    var losAngeles = {
        lat: 34.059834,  
        lng: -118.366871
    };

    
    map = new google.maps.Map(document.getElementById('map'), {
        center: losAngeles,
        zoom: 13,
        mapTypeControlOptions: {
            mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
                    'styled_map']
          }
    });

    map.mapTypes.set('styled_map', styledMapType);
    map.setMapTypeId('styled_map');

      infoWindow = new google.maps.InfoWindow();
        
    searchStores();
}

function searchStores(){
  var zipCode = document.getElementById('zip-code-input').value;
  var foundStores=[];
  if(zipCode){
    for(store of stores){
    
      var postal = store['address']['postalCode'].substring(0,5);
      if(postal==zipCode){
       foundStores.push(store);
      }
    }
       }else{
       foundStores = stores;
       }
  
  clearLocations();
  displayStores(foundStores);
  showStoresMarkers(foundStores);
  setOnClickListener();
}

function clearLocations(){
  infoWindow.close();
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers.length = 0;
}

function setOnClickListener(){
  var storeElemets = document.querySelectorAll('.store-container');
      storeElemets.forEach(function(elem,index){
        elem.addEventListener('click',function(){
          new google.maps.event.trigger(markers[index], 'click');
      })
        
      })
    }

 
function displayStores(stores){

    var storesHtml = "";
    var numberIndex = 0;
    for(var store of stores){

        var address = store['addressLines']
        var phone = store['phoneNumber']
        numberIndex++;
        storesHtml+= `
        <div class="store-container">
        <di class="store-container-background">
        <div class="store-info-container">
            <div class="store-address">
                <span>${address[0]}</span>
                <span>${address[1]}</span>
            </div>
             <div class="store-phone-number">${phone}</div>
        </div>
             <div class="store-number-container">
                 <div class="store-number">
                     ${numberIndex}
                 </div>
             </div>
        </div>
        </div>
 
        `
        document.querySelector('.stores-list').innerHTML = storesHtml;

    
    }
}


function showStoresMarkers(stores) {
    var bounds = new google.maps.LatLngBounds();
    for(var [index,store] of stores.entries()){
        var latlng = new google.maps.LatLng(
            store["coordinates"]["latitude"],
            store["coordinates"]["longitude"]);
        var name = store["name"];
        var address = store["addressLines"][0]
        var phoneNumber=store["phoneNumber"]
        var openStatusText=store["openStatusText"]
        bounds.extend(latlng);    
        createMarker(latlng,name,address,phoneNumber,openStatusText, index+1)
    }
    map.fitBounds(bounds);
}


function createMarker(latlng,name,address,phoneNumber,openStatusText,index){

    var link=address;

    var complement=link.replace(/\ /g, "+");

    var html = `

        <div class="store-info-window">

              <div class="store-info-name">
                <a style="color:#041226;" href="https://www.google.com/maps/search/?api=1&query=${complement}" target="_blank">${name}</a> 
              </div>


              <div class="store-info-status">
                ${openStatusText}
              </div>


              <div class="store-info-address">
                <div class="circle">
                  <i class="fas fa-hand-point-right"></i>
                </div>
                ${address}
            </div>
            <div class="store-info-phone">
                <div class="circle">
                <i class="fas fa-phone-volume"></i>
                </div>
                ${phoneNumber}
            </div>
                      
        </div>   

    
    
    
    `
    ;
          var marker = new google.maps.Marker({
            map: map,
            position: latlng,
            label:index.toString(),
            icon:{
                url:"tienda.png",
                labelOrigin:{x:24,y:25}
            }
          });
         
           google.maps.event.addListener(marker, 'click', function() {
           infoWindow.setContent(html);
           infoWindow.open(map, marker);
               });
          markers.push(marker);
}

