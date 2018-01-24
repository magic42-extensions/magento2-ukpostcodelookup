/**
 * Lets define the CraftyClicks Constructor
 * @cfg {object} containing base configurations.
 */

function cc_ui_handler(cfg){
	//console.log(cfg);
	this.cfg = cfg;

	var lines = 0;
	if(typeof cfg.dom.address_1 !== "undefined"){
		lines++;
	}
	if(typeof cfg.dom.address_2 !== "undefined"){
		lines++;
	}
	if(typeof cfg.dom.address_3 !== "undefined"){
		lines++;
	}
	this.cfg.core.lines = lines;
	this.cc_core = new cc_rapid(this.cfg.core);
}
/**
 * Fetches data from the api based on the configuration, and stores it.
 * Skips the lookup if the data is already looked up.
 * @return {object} the response data set.
 */

cc_ui_handler.prototype.sort = function(is_uk){
	var elems = this.cfg.dom;
	var country = elems.country.parents(this.cfg.sort_fields.parent).last();
	// Sort disabled; position country on top
	var company = elems.company.parents(this.cfg.sort_fields.parent).last();
	var line_1 = elems.address_1.parents(this.cfg.sort_fields.parent).last();
	var postcode = elems.postcode.parents(this.cfg.sort_fields.parent).last();
	if (company.length) {
		country.insertBefore(company);
	}
	else {
		country.insertBefore(line_1);
	}
	var searchContainer = {};
	if(this.cfg.search_type != 'traditional'){
		searchContainer = this.search_object.parents(this.cfg.sort_fields.parent).last();
		country.after(searchContainer);
	} else {
		searchContainer = this.search_object;
		country.after(searchContainer);
		//IWD checkout - temporary
		if (jQuery('.crafty-results-container').length > 0) {
			searchContainer.after(searchContainer.closest('.fieldset').find('.crafty-results-container'));
		}
	}

	if(this.cfg.hide_fields){
		var tagElement = [];
		if(this.cfg.search_type != 'traditional'){
			tagElement = ['postcode', 'company', 'address_1', 'town', 'county', 'county_list'];
		} else {
			tagElement = ['company', 'address_1', 'town', 'county', 'county_list'];
		}
		for(var i=0; i < tagElement.length; i++){
			elems[tagElement[i]].parents(this.cfg.sort_fields.parent).last().addClass('crafty_address_field');
		}
	}
};

cc_ui_handler.prototype.country_change = function(country){

	var active_countries = ['GB','IM','JE','GY'];
	if(active_countries.indexOf(country) != -1){
		if(this.cfg.sort_fields.active){
			this.sort(true);
		}
		this.search_object.parents(this.cfg.sort_fields.parent).last().show();

	} else {
		if(this.cfg.sort_fields.active){
			this.sort(false);
		}
		this.search_object.parents(this.cfg.sort_fields.parent).last().hide();
	}
	if(active_countries.indexOf(country) != -1){
		this.search_object.find('.search-bar .action').show();
	} else {
		this.search_object.find('.search-bar .action').hide();
	}
	if(this.cfg.hide_fields && (active_countries.indexOf(country) != -1) && (this.cfg.dom.postcode.val() === "")){
		this.search_object.closest(this.cfg.sort_fields.parent).parent().find('.crafty_address_field').addClass('crafty_address_field_hidden');
	} else {
		this.search_object.closest(this.cfg.sort_fields.parent).parent().find('.crafty_address_field').removeClass('crafty_address_field_hidden');
	}
};

cc_ui_handler.prototype.activate = function(){
	this.addui();
	if(this.cfg.only_uk){
		this.country_change(this.cfg.dom.country.val());
		// transfer object to event scope
		var that = this;
		this.cfg.dom.country.on('change',function(){
			// selected country
			var sc = jQuery(this).val();
			that.country_change(sc);
		});
	}
};

cc_ui_handler.prototype.addui = function(){
	// transfer object to event scope
	var that = this;
	// apply dom elements
	var html = '';

	if(this.cfg.search_type != 'traditional' && typeof this.cfg.search_wrapper !== 'undefined'){
		html = this.cfg.search_wrapper.before + html + this.cfg.search_wrapper.after;
	}
	if(this.cfg.search_type != 'traditional'){
		this.cfg.dom.country.parents(this.cfg.sort_fields.parent).last().after(html);
	} else {
		// input after postcode
		var postcode_elem = this.cfg.dom.postcode;
		postcode_elem.wrap('<div class="search-bar"></div>');
		postcode_elem.addClass('search-box');
		postcode_elem.after('<button type="button" class="action primary">'+
						'<span>'+this.cfg.txt.search_buttontext+'</span></button>');
		var new_container = postcode_elem.closest(this.cfg.sort_fields.parent);
		new_container.addClass('search-container').attr('id',this.cfg.id).addClass('type_3');
		// add search list
		if (this.cfg.dom.country.hasClass('admin__control-select')) {
			postcode_elem.closest('.search-bar').after('<div class="search-list" style="display: none;">'+
								'<select class="admin__control-select"></select>'+
								'</div>'+
								'<div class="mage-error" generated><div class="search-subtext"></div></div>');
		}
		//IWD Checkout - temporary
		else if(jQuery('.iwd_opc_select_container').length > 0) {
			postcode_elem.closest('.field').after('<div class="field crafty-results-container" style="display:none;"><div class="control"><div class="scroll-wrapper" tabindex="0" style="position: relative;">'+
			'<div class="iwd_opc_select_container scroll-content selected crafty_iwd_container" style="height: auto;">'+
			'</div><div class="scroll-element scroll-x"><div class="scroll-element_outer"><div class="scroll-element_size"></div><div class="scroll-element_track"></div><div class="scroll-bar" style="width: 100px;"></div></div></div><div class="scroll-element scroll-y"><div class="scroll-element_outer"><div class="scroll-element_size"></div>'+
			'<div class="scroll-element_track"></div><div class="scroll-bar" style="height: 100px; top: 0px;"></div></div></div></div></div></div>');
		}
		else {
			postcode_elem.closest('.search-bar').after('<div class="search-list" style="display: none;">'+
									'<select></select>'+
						 			'</div>'+
						 			'<div class="mage-error" generated><div class="search-subtext"></div></div>');
		}

	}

	// apply postcode lookup (by button)
	this.search_object = jQuery('.search-container[id="'+this.cfg.id+'"]');
	this.search_object.find('.action').on('click',function(){
		//IWD Chceckout - temporary
		if (jQuery('.iwd_opc_select_container').length > 0) {
			that.lookup_iwd(that.search_object.find('.search-box').val());
		}
		else {
			that.lookup(that.search_object.find('.search-box').val());
		}
	});
	// apply hiding of list on input change && auto search
	this.search_object.find('.search-box').on('keyup',function(){
		that.search_object.find('.search-list').hide();
		that.search_object.find('.extra-info').hide();

		that.search_object.find('.mage-error').hide();

		if(that.cfg.search_type != 'traditional'){
			// apply auto search
			if(that.cfg.auto_search && (that.cc_core.clean_input(jQuery(this).val()) !== null)){
				that.lookup(that.search_object.find('.search-box').val());
			}
		}
	});

};

cc_ui_handler.prototype.lookup = function(postcode){
	var dataset = this.cc_core.search(postcode);
	if(typeof dataset.error_code != "undefined"){
		this.prompt_error(dataset.error_code);
		return;
	}
	var new_html = "";
	for(var i=0; i < dataset.delivery_point_count; i++){
		var elems = [];
		var endpoint = dataset.delivery_points[i];
		if(endpoint.department_name !== "")
			elems.push(endpoint.department_name);
		if(endpoint.organisation_name !== "")
			elems.push(endpoint.organisation_name);
		if(endpoint.line_1 !== "")
			elems.push(endpoint.line_1);
		if(endpoint.line_2 !== "")
			elems.push(endpoint.line_2);
		if(this.cfg.search_type != 'traditional'){
			new_html += '<li data-id="'+i+'"><span style="font-weight: bold;">'+dataset.town+', </span><span style="font-style: italic;">' + elems.join(', ') + '</span></li>';
		} else {
			new_html += '<option data-id="'+i+'">'+dataset.town+', ' + elems.join(', ') + '</option>';
		}
	}
	var search_list = this.search_object.find('.search-list');
	if(this.cfg.search_type != 'traditional'){
		search_list.find('ul').html(new_html);
	} else {
		search_list.find('select').html('<option>Select Your Address</option>'+new_html);
	}
	search_list.show();

	this.search_object.find('.extra-info .search-subtext').html(dataset.town);
	this.search_object.find('.extra-info').show();
	var that = this;

	if(this.cfg.search_type != 'traditional'){
		search_list.find('li').on('click',function(){
			that.select(postcode, jQuery(this).data('id'));
			search_list.hide();
		});
	} else {
		search_list.find('select').off('change');
		search_list.find('select').on('change',function(){
			that.select(postcode, jQuery(this).find('option:selected').data('id'));
			search_list.hide();
		});
	}

	if(that.cfg.search_type != 'traditional'){
		this.search_object.on('focusout',function(){
			// give a tiny time for the on click event to trigger first
			setTimeout(function(){
				search_list.hide();
			}, 250);
		});
	}
};

cc_ui_handler.prototype.lookup_iwd = function(postcode){
	var dataset = this.cc_core.search(postcode);
	if(typeof dataset.error_code != "undefined"){
		this.prompt_error(dataset.error_code);
		return;
	}
	var new_html = "";
	for(var i=0; i < dataset.delivery_point_count; i++){
		var elems = [];
		var endpoint = dataset.delivery_points[i];
		if(endpoint.department_name !== "")
			elems.push(endpoint.department_name);
		if(endpoint.organisation_name !== "")
			elems.push(endpoint.organisation_name);
		if(endpoint.line_1 !== "")
			elems.push(endpoint.line_1);
		if(endpoint.line_2 !== "")
			elems.push(endpoint.line_2);
		new_html += '<div class="iwd_opc_select_option option_element" data-id="'+i+'">'+dataset.town+', ' + elems.join(', ') + '</div>';
	}
	var search_list = this.search_object.closest('div.fieldset').find('.crafty_iwd_container');
	search_list.html('<div class="iwd_opc_select_option selected">Select Your Address</div>'+new_html);
	search_list.closest('div.crafty-results-container').show();

	this.search_object.find('.extra-info .search-subtext').html(dataset.town);
	this.search_object.find('.extra-info').show();
	var that = this;

	jQuery(search_list).find('div.option_element').off('click');

	jQuery(search_list).find('div.option_element').on('click', function(){
		that.select(postcode, jQuery(this).attr('data-id'));
		search_list.closest('div.crafty-results-container').hide();
	});

	if(that.cfg.search_type != 'traditional'){
		this.search_object.on('focusout',function(){
			// give a tiny time for the on click event to trigger first
			setTimeout(function(){
				search_list.hide();
			}, 250);
		});
	}
};



cc_ui_handler.prototype.prompt_error = function(error_code){
	if(!this.cfg.error_msg.hasOwnProperty(error_code)){
		// simplyfy complex error messages
		error_code = "0004";
	}
	this.search_object.find('.mage-error .search-subtext').html(this.cfg.error_msg[error_code]);
	this.search_object.find('.mage-error').show();
};
cc_ui_handler.prototype.select = function(postcode, id){
	var dataset = this.cc_core.get_store(this.cc_core.clean_input(postcode));

	this.cfg.dom.town.val(dataset.town);
	this.cfg.dom.postcode.val(dataset.postcode);

	var company_details = [];
	if(dataset.delivery_points[id].department_name !== ""){
		company_details.push(dataset.delivery_points[id].department_name);
	}
	if(dataset.delivery_points[id].organisation_name !== ""){
		company_details.push(dataset.delivery_points[id].organisation_name);
	}

	this.cfg.dom.company.val(company_details.join(', '));

	for(var i=1; i<=this.cfg.core.lines; i++){
		this.cfg.dom["address_"+i].val(dataset.delivery_points[id]["line_"+i]);
	}

	if(this.cfg.hide_fields){
		jQuery('.crafty_address_field').removeClass('crafty_address_field_hidden');
	}
	if(this.cfg.search_type != 'traditional' && this.cfg.clean_postsearch){
		this.search_object.find('.search-box').val('');
	}
	// trigger change for checkout validation
	jQuery.each(this.cfg.dom, function(index, name){
		name.trigger('change');
	});
};
