function disableButtonBeforeNoon() {
  var currentDate = new Date();
  var currentHour = currentDate.getHours();
  var button = document.querySelector('.t-submit');  // Define your button with class '.t-submit'

  if (currentHour < 12 && button) {
      button.setAttribute("disabled", "disabled");  // Using jQuery, you'd do: button.prop('disabled', true);
  }
}

$(document).ready(function() {

  function clearTotalWrapClass(){ $('.t706__cartwin-totalamount-wrap').removeClass('vivoz')};
  totalWrap = $('.t706__cartwin-totalamount-wrap');
    const apiKey = '6b5c65f4-1bd2-4fcf-89fd-897140ba4118'; // replace with your Yandex API key
    const defaultCoordinates = { lat: 56.841281, lng: 60.611237 };
    // Haversine formula to calculate the distance between two sets of coordinates
    function calculateDistance(coord1, coord2) {
      function toRad(value) { return value * Math.PI / 180; } 
      
      let R = 6371; // Earth radius in kilometers
      let dLat = toRad(coord2.lat - coord1.lat);
      let dLon = toRad(coord2.lng - coord1.lng);
  
      let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(coord1.lat)) * Math.cos(toRad(coord2.lat)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
      
      let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      let distance = R * c;
  
      return distance;
    }
    function showAlert() {
      var currentDate = new Date();
      var currentHour = currentDate.getHours();
  
      if (currentHour <= 12) {
          alert("Not yet");
      }
  }
  disableButtonBeforeNoon();
  // Call the showAlert function
  showAlert();

    $('input[name="delivery_type"][value="Самовывоз"]').change(function(){
      clearTotalWrapClass();
    if ($('input[name="delivery_type"][value="Самовывоз"]').is(':checked')){
            $('input[name="adres"]').css('display', 'none')
            $('input[name="adres"]').prop('required', false)
            $('#field-title_1696262318533').css('display', 'none');
    } 
});

$('input[name="delivery_type"][value="Доставка"]').change(function(){
  clearTotalWrapClass();
    if ($('input[name="delivery_type"][value="Доставка"]').is(':checked')){
        $('input[name="adres"]').css('display', '')
        $('#field-title_1696262318533').css('display', '');
        $('input[name="adres"]').prop('required', true)
}    
});


$('input[name="delivery_type"][value="Самовывоз"]').change(function(){
  clearTotalWrapClass();
  totalWrap = $('.t706__cartwin-totalamount-wrap');
    if ($('input[name="delivery_type"][value="Самовывоз"]').is(':checked') && tcart.prodamount >= 1500){
            tcart.promocode = {};
            tcart.promocode.discountpercent = 10
            totalWrap.addClass('vivoz');
            tcart__updateTotalProductsinCartObj();
            tcart__reDrawProducts();tcart__reDrawTotal();
            totalWrap.addClass('vivoz');
    }
    if (!$('input[name="delivery_type"][value="Самовывоз"]').is(':checked')){
            delete tcart.promocode
            totalWrap.addClass('dostavka');
            tcart__updateTotalProductsinCartObj();
            tcart__reDrawProducts();tcart__reDrawTotal();
    }
    if ($('input[name="delivery_type"][value="Самовывоз"]').is(':checked') && tcart.prodamount < 1500){
      delete tcart.promocode
      totalWrap.addClass('dostavka');
      tcart__updateTotalProductsinCartObj();
      tcart__reDrawProducts();tcart__reDrawTotal();
    }
});


    $('input[name="adres"]').change(function(){
      clearTotalWrapClass();
      let street = $(this).val();
  
      // Prepend the city and country to the street
      let address = `Ekaterinburg, Russia, ${street}`;
  
      // Prepare the request to the Yandex Geocoding API
      let geocodingAPI = `https://geocode-maps.yandex.ru/1.x/?format=json&apikey=${apiKey}&geocode=${encodeURIComponent(address)}`;
  
      $.getJSON(geocodingAPI, function (data, status) {
        if (status === "success" && data.response.GeoObjectCollection.featureMember.length > 0) {
          let location = data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos; 
          let locationArray = location.split(" ");
          let lat = locationArray[1];
          let lon = locationArray[0];
          
          let currentCoordinates = { lat: parseFloat(lat), lng: parseFloat(lon) };

          console.log(currentCoordinates); // Outputs the location (lat/lng)
          let distance = calculateDistance(defaultCoordinates, currentCoordinates);
            // Insert the code you want to execute here
            if (tcart.prodamount >= 5000){
              $('input[name="delivery_type"][value="Доставка"]').attr("data-delivery-price",0)
              totalWrap.addClass('dostavka');
              tcart__reDrawProducts();tcart__reDrawTotal();
              tcart__updateDelivery();
        }
        else if (distance+0.5 <= 2){
          $('.t706__product').each(function(){
           });
           $('input[name="delivery_type"][value="Доставка"]').attr("data-delivery-price",0)
           totalWrap.addClass('dostavka');
           tcart__reDrawProducts();tcart__reDrawTotal();
           tcart__updateDelivery();
        }
        else if(distance+1 <= 5 && distance+1 > 2){
          $('input[name="delivery_type"][value="Доставка"]').attr("data-delivery-price",150)
          totalWrap.addClass('dostavka');
           tcart__reDrawProducts();tcart__reDrawTotal();
           tcart__updateDelivery();
        }else if(distance+1 <= 10 && distance+1 > 5){
          $('input[name="delivery_type"][value="Доставка"]').attr("data-delivery-price",200)
          totalWrap.addClass('dostavka');
           tcart__reDrawProducts();tcart__reDrawTotal();
           tcart__updateDelivery();
        }else if(distance+1 <= 15 && distance+1 > 10){
          $('input[name="delivery_type"][value="Доставка"]').attr("data-delivery-price",300)
          totalWrap.addClass('dostavka');
           tcart__reDrawProducts();tcart__reDrawTotal();
           tcart__updateDelivery();
        }
            console.log('The input was clicked!');
          console.log(distance); // Outputs the distance in kilometers
        } else {
          console.log("Geocoding was not successful or returned no results.");
        }
      });
      console.log(tcart.prodamount)
      if (tcart.prodamount < 1000){
        console.log('did')
        tcart__addProduct({name: 'Минимальная сумма заказа 1000р', price: 1000 - tcart.prodamount})
        tcart.t
        totalWrap.addClass('dostavka');
        tcart__reDrawProducts();tcart__reDrawTotal();
        tcart__updateDelivery();
      }else{
        $('p[name="min_sum"]').remove();
        totalWrap.addClass('dostavka');
        tcart__reDrawProducts();tcart__reDrawTotal();
        tcart__updateDelivery();
      }
    });

    $('input[name="delivery_type"][value="Самовывоз"]').change(function(){
      clearTotalWrapClass();
      totalWrap = $('.t706__cartwin-totalamount-wrap');
      if ($('input[name="delivery_type"][value="Самовывоз"]').is(':checked') && tcart.prodamount >= 1500){
              tcart.promocode = {};
              tcart.promocode.discountpercent = 10
              totalWrap.addClass('vivoz');
              tcart__updateTotalProductsinCartObj();
              tcart__reDrawProducts();tcart__reDrawTotal();
              totalWrap.addClass('vivoz');
      }
      if (!$('input[name="delivery_type"][value="Самовывоз"]').is(':checked')){
              delete tcart.promocode
              totalWrap.addClass('dostavka');
              tcart__updateTotalProductsinCartObj();
              tcart__reDrawProducts();tcart__reDrawTotal();
      }
      if ($('input[name="delivery_type"][value="Самовывоз"]').is(':checked') && tcart.prodamount < 1500){
        delete tcart.promocode
        totalWrap.addClass('dostavka');
        tcart__updateTotalProductsinCartObj();
        tcart__reDrawProducts();tcart__reDrawTotal();
      }
  });

  $('input[name="delivery_type"][value="Доставка"]').change(function(){
    clearTotalWrapClass();
    totalWrap = $('.t706__cartwin-totalamount-wrap');
    if ($('input[name="delivery_type"][value="Самовывоз"]').is(':checked') && tcart.prodamount >= 1500){
            tcart.promocode = {};
            tcart.promocode.discountpercent = 10
            totalWrap.addClass('vivoz');
            tcart__updateTotalProductsinCartObj();
            tcart__reDrawProducts();tcart__reDrawTotal();
            totalWrap.addClass('vivoz');
    }
    if (!$('input[name="delivery_type"][value="Самовывоз"]').is(':checked')){
            delete tcart.promocode
            totalWrap.addClass('dostavka');
            tcart__updateTotalProductsinCartObj();
            tcart__reDrawProducts();tcart__reDrawTotal();
    }
    if ($('input[name="delivery_type"][value="Самовывоз"]').is(':checked') && tcart.prodamount < 1500){
      delete tcart.promocode
      totalWrap.addClass('dostavka');
      tcart__updateTotalProductsinCartObj();
      tcart__reDrawProducts();tcart__reDrawTotal();
    }
});
  });
