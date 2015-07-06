function UniVector(coord){
  this.constructor = UniVector;

  if(coord){
    if(coord.constructor === UniVector){
      this.coord = UniVector.copy(coord.coord);
    } else {
      this.coord = coord;
    }
  } else {
    this.coord = [];
  }
}

UniVector.parseVectorArg = function(arg){
  if(arg.constructor !== UniVector){
    return new UniVector(arg);
  }
  return arg;
};

UniVector.copy = function(obj){
  var copy = [];
  for(var i = 0; i < obj.length; i++){
    copy[i] = obj[i];
  }
  return copy;
};

UniVector.prototype = {
  get dim(){ return this.coord.length; },

  get: function(n){
    if(!isNaN(this.coord[n])){
      return this.coord[n];
    } else {
      return 0;
    }
  },

  copy: function(){
    return new UniVector(this);
  },

  add_s: function(vector){
    vector = UniVector.parseVectorArg(vector);
    var maxdim = vector.dim;
    if(maxdim < this.dim){
      maxdim = this.dim;
    }

    for (var i = 0; i < maxdim; i++) {
      this.coord[i] = this.get(i) + vector.get(i);
    }

    return this;
  },

  sub_s: function(vector){
    vector = UniVector.parseVectorArg(vector);
    return this.add_s(vector.getOpposite());
  },

  mul_s: function(scalar){
    for (var i = 0; i < this.coord.length; i++) {
      this.coord[i] = scalar * this.get(i); 
    };
    return this;
  },

  div_s: function(scalar){
    return this.mul_s(1 / scalar);
  },

  add: function(vector){
    var newvector = new UniVector(vector);
    return newvector.add_s(this);
  },

  sub: function(vector){
    vector = UniVector.parseVectorArg(vector);
    return this.add(vector.getOpposite());
  },

  mul: function(scalar){
    var newvector = new UniVector(this);
    return newvector.mul_s(scalar);
  },

  div: function(scalar){
    return this.mul(1 / scalar);
  },

  getOpposite: function(){
    return this.mul(-1);
  },

  getNorm: function(squared){
    var norm = 0;
    for (var i = 0; i < this.dim; i++) {
      norm += Math.pow(this.get(i), 2);
    }

    if(squared){
      return norm;
    } else {
      return Math.sqrt(norm)
    }
  },

  getUnitVector: function(){
    return this.mul(1 / this.getNorm());
  },

  scalarProduct: function(vector){
    var maxdim = vector.dim;
    if(maxdim < this.dim){
      maxdim = this.dim;
    }

    var result = 0;
    for (var i = 0; i < maxdim; i++) {
      result += this.get(i) * vector.get(i);
    }

    return result;
  },

  toString: function(){
    var str = "[", i;
    for (i = 0; i < this.dim - 1; i++) {
      str += this.get(i) + ",";
    }
    str += this.get(i) + "]";
    return str;
  }
};
