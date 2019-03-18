var $j = jQuery.noConflict();

$j(document).ready(function(){
  $j('#troop_picked').hide();
  $j('#change_troop').click(change_troop);
  $j('#troopsearch').autocomplete({
    source: nslodge_ajax.ajaxurl + '?action=ns_get_troops_autocomplete',
    select: function( event, ui ) {
        $j("#ChapterName").val(ui.item.SelectorName).change();
        $j("#UnitType").val(ui.item.unit_type);
        $j("#UnitNumber").val(ui.item.unit_num);
        $j("#ULName").val(ui.item.ul_full_name);
        $j("#CCName").val(ui.item.cc_full_name);
        $j('#troop_result').html(ui.item.label);
        $j('#troop_picker').hide();
        $j('#troop_picked').show();
        $j('#troopsearch').val("");
        return false;
    },
  }).autocomplete("instance")._renderItem = function( ul, item ) {
    //alert(JSON.stringify(item))
    city = item.unit_city;
    if (!city) { city = "" }
    if (city.length > 2) {
        city = ' - ' + city;
    }
    item.label = item.district_name + " - " + item.unit_type + " " + item.unit_num + city + " (" + item.SelectorName + ")";
    li = $j('<li>')
      .attr("data-value", JSON.stringify(item))
      .append(item.label)
      .appendTo(ul);
    return li;
  }
  $j('#DateOfBirth').change(function(){
    var age = getAge($j('#DateOfBirth').val());
    $j('#scout_age').text("(Age: " + age + ")");
  });
  $j('#recommendation').change(function(){
      if ($j('#recommendation').val() == 'Unit Recommendation') {
          $j('#unit_unpicked').hide();
          $j('#district_picker').hide();
          $j('#district_search').val("");
          $j('#troop_picker').show();
          $j('#troop_picked').hide();
          $j('#district_picked').hide();
          $j('input[name=UnitType]').val('Troop');
      }
      else if ($j('#recommendation').val() == 'District/Council Recommendation') {
          $j('#unit_unpicked').hide();
          $j('#district_picker').show();
          $j('#district_search').val("");
          $j('#troop_picker').hide();
          $j('#troop_picked').hide();
          $j('#district_picked').hide();
      }
      else {
          $j('#unit_unpicked').show();
          $j('#district_picker').hide();
          $j('#district_search').val("");
          $j('#troop_picker').hide();
          $j('#troop_picked').hide();
          $j('#district_picked').hide();
      }
  });
  $j('#district_search').change(function(){
      unittype = 'District';
      unitnum = $j('#district_search').val();
      if (unitnum == 'PF') {
          unittype = 'Council';
          unitnum = '781';
          $j('#ChapterName').val('PFFSC Staff').change();
      }
      else if (unitnum == 'MCC') {
          unittype = 'Council';
          unitnum = '780';
          $j('#ChapterName').val('MCC Staff').change();
      }
      else {
          $j('#district_picked').show();
          $j("#ChapterName option[value='']").attr('selected',true);
      }
      displaytext = $j('#district_search').find('option:selected').html() + ' - ' + unittype + ' ' + unitnum;
      $j('#UnitType').val(unittype);
      $j('#UnitNumber').attr('value',unitnum);
      // ^ this doesn't work with .val() for some reason, maybe because type="number"
      $j('#troop_result').html(displaytext);
      $j('#district_picker').hide();
      $j('#troop_picker').hide();
      $j('#troop_picked').show();
  });

});

function change_troop(){
    $j('#recommendation').change();
    return false;
}

function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}
