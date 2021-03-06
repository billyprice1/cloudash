var CPUChart = function(placeholder, opts) {
  this.placeholder = placeholder;

  this.points = [{
    data: [],
    color: '#F77A52',
    name: 'CPU (%)'
  }];
};

CPUChart.prototype.init = function() {
  var self = this;

  this.graph = new Rickshaw.Graph({
    element: document.getElementById(self.placeholder),
    renderer: 'line',
    series: self.points
  });

  this.xAxis = new Rickshaw.Graph.Axis.Time({
    graph: self.graph,
    ticksTreatment: 'glow'
  });

  this.yAxis = new Rickshaw.Graph.Axis.Y({
    graph: self.graph,
    tickFormat: function(y) {
      var abs_y = Math.abs(y);
      if (abs_y === 0) {
        return '';
      } else {
        return y + '%';
      }
    },
    ticks: 5,
    ticksTreatment: 'glow'
  });

  self.hoverDetail = new Rickshaw.Graph.HoverDetail({
    graph: self.graph,
    formatter: function(series, x, y) {
      var date = '<span class="date">' + new Date(x * 1000).toUTCString() + '</span>';
      var swatch = '<span class="detail_swatch" style="background-color: ' + series.color + '"></span>';
      var content = swatch + series.name + ": " + parseInt(y) + '<br>' + date;
      return content;
    }
  });
};

CPUChart.prototype.draw = function() {
  var self = this;
  this.graph.configure({
    width: $('#' + self.placeholder).width(),
    height: $('#' + self.placeholder).height()
  });
  this.graph.render();
  this.xAxis.render();
  this.yAxis.render();
};

CPUChart.prototype.appendData = function(data, nulls) {
  this.formatData(data);
  this.draw();
};

CPUChart.prototype.formatData = function(data) {
  this.points[0].data = [];
  for (var i = 0; i < data.length; i++) {
    var reading = data[i];
    this.points[0].data.push({
      'x': parseInt(reading.time),
      'y': parseInt(reading.cpu)
    });
  }
};
