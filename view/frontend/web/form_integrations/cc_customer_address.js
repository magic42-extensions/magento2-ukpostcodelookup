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
				parent: '.field:not(.additional)'
			},
			hide_fields: crafty_cfg.hide_fields,
			txt: crafty_cfg.txt,
			error_msg: crafty_cfg.error_msg,
			county_data: crafty_cfg.advanced.county_data
		};
		var address_dom = {
			company:	jQuery("[name='company']"),
			address_1:	jQuery("#street_1"),
			address_2:	jQuery("#street_2"),
			postcode:	jQuery("[name='postcode']"),
			town:		jQuery("[name='city']"),
			county:		jQuery("[name='region']"),
			county_list:jQuery("[name='region_id']"),
			country:	jQuery("[name='country_id']")
		};
		cfg.dom = address_dom;
		cfg.id = "m2_address";
		if(cc_activate_flags.indexOf(cfg.id) == -1 && cfg.dom.postcode.length == 1){
			cc_activate_flags.push(cfg.id);

			// modify the Layout
			var postcode_elem = cfg.dom.postcode;
			postcode_elem.wrap('<div class="search-bar"></div>');
			postcode_elem.after('<button type="button" class="action primary">'+
			'<span>'+cfg.txt.search_buttontext+'</span></button>');
			// STANDARD
			postcode_elem.closest('.search-bar').after('<div class="search-list" style="display: none;"><select></select></div>'+
									'<div class="mage-error" generated><div class="search-subtext"></div></div>');

			// input after postcode
			var new_container = postcode_elem.closest(cfg.sort_fields.parent);
			new_container.addClass('search-container').attr('id',cfg.id).addClass('type_3');

			var cc_billing = new cc_ui_handler(cfg);
			cc_billing.activate();
		}
	}
}

requirejs(['jquery'], function( $ ) {
	jQuery( document ).ready(function() {
		if(crafty_cfg.enabled){
			setInterval(activate_cc_m2_uk,200);
		}
	});
});
