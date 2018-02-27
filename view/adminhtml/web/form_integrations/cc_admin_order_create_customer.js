
var cc_activate_flags = [];
function activate_cc_m2_uk(){
	if(crafty_cfg.enabled){
		var cfg = {
			id: "",
			core: {
				key: crafty_cfg.key,
				preformat: true,
				capsformat: {
					address: true,
					organization: true,
					county: true,
					town: true
				}
			},
			dom: {},
			sort_fields: {
				active: true,
				parent: 'div.admin__field'
			},
			hide_fields: crafty_cfg.hide_fields,
			txt: crafty_cfg.txt,
			error_msg: crafty_cfg.error_msg,
			county_data: crafty_cfg.advanced.county_data
		};
		var dom = {
			company:	'[name$="_address][company]"]',
			address_1:	'[name$="_address][street][0]"]',
			address_2:	'[name$="_address][street][1]"]',
			postcode:	'[name$="_address][postcode]"]',
			town:		'[name$="_address][city]"]',
			county:		'[name$="_address][region]"]',
			county_list:'[name$="_address][region_id]"]',
			country:	'select[name$="_address][country_id]"]'
		};
		var postcode_elements = jQuery(dom.postcode);
		postcode_elements.each(function(index){
			if(postcode_elements.eq(index).data('cc') != '1'){
				var active_cfg = {};
				jQuery.extend(active_cfg, cfg);
				active_cfg.id = "m2_"+cc_index;
				var form = postcode_elements.eq(index).closest('fieldset');
				cc_index++;
				active_cfg.dom = {
					company:		form.find(dom.company),
					address_1:		form.find(dom.address_1),
					address_2:		form.find(dom.address_2),
					postcode:		postcode_elements.eq(index),
					town:			form.find(dom.town),
					county:			form.find(dom.county),
					county_list:	form.find(dom.county_list),
					country:		form.find(dom.country)
				};
				// modify the Layout
				var postcode_elem = active_cfg.dom.postcode;
				postcode_elem.wrap('<div class="search-bar"></div>');
				postcode_elem.after('<button type="button" class="action primary">'+
				'<span>'+active_cfg.txt.search_buttontext+'</span></button>');

				// ADMIN
				postcode_elem.closest('.search-bar').after('<div class="search-list" style="display: none;">'+
					'<select class="admin__control-select"></select>'+
					'</div><div class="mage-error" generated><div class="search-subtext"></div></div>');

				// input after postcode
				var new_container = postcode_elem.closest(active_cfg.sort_fields.parent);
				new_container.addClass('search-container').attr('id',active_cfg.id).addClass('type_3');

				active_cfg.ui = {
					top_elem: 'div.admin__page-section-item'
				};

				active_cfg.dom.postcode.data('cc','1');
				var cc_generic = new cc_ui_handler(active_cfg);
				cc_generic.activate();
			}
		});
	}
}

var cc_index = 0;
requirejs(['jquery'], function( $ ) {
	jQuery( document ).ready(function() {
		if(crafty_cfg.enabled){
			setInterval(activate_cc_m2_uk,200);
		}
	});
});
