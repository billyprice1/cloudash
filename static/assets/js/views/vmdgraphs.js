window.VMDGraphsView = Backbone.View.extend({
  initialize: function(options) {
    this.vm = options.vm;
  },
  events: {

  },
  loadCharts: function() {
    modem('GET', 'vm/' + this.model.get('id') + '/metrics',
      function(json) {
        var cpuChart = new CPUChart('placeHolder1');
        var memoryChart = new MemoryChart('placeHolder2');
        var networkChart = new NetworkChart('placeHolder3');
        cpuChart.init();
        memoryChart.init();
        networkChart.init();
        cpuChart.appendData(json.stats);
        memoryChart.appendData(json.stats);
        networkChart.appendData(json.stats);

        window.addEventListener('resize', function() {
          setTimeout(function() {
            cpuChart.draw();
            memoryChart.draw();
            networkChart.draw();
          }, 250);
        });
      },
      function(xhr, ajaxOptions, thrownError) {
        var json = JSON.parse(xhr.responseText);
        console.log(json);
        showError('ERRO - ' + title, json.error);
      }
    );
  },
  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));
    console.log(this.model.toJSON());
    $('.vm-details', this.el).i18n();
    $('.overme', this.el).tooltip();
    this.loadCharts();
    var self = this;
    return this;
  }

});