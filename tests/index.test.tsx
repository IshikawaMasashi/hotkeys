import * as kiwi from '../src/kiwi';


describe('kiwi', () => {
  it('create Solver', () => {
    var solver = new kiwi.Solver();
    expect(solver).toBeTruthy();
  });

  describe('Variable', () => {
    var solver = new kiwi.Solver();
    var variable: kiwi.Variable;
    it('new Variable() => value: 0', () => {
      variable = new kiwi.Variable();
      // assert(variable);
      expect(variable).toBeTruthy();
      // assert.equal(0, variable.value());
      expect(variable.value()).toBe(0);
    });
    it('new Variable("somename") => name: "somename"', () => {
      var var2 = new kiwi.Variable('somename');
      // assert.equal(var2.name(), "somename");
      expect(var2.name()).toBe('somename');
    });
    it('variable.setName("skiwi") => name: "skiwi"', () => {
      var var2 = new kiwi.Variable();
      var2.setName('skiwi');
      // assert.equal(var2.name(), "skiwi");
      expect(var2.name()).toBe('skiwi');
    });
    it('solver.addEditVariable(variable, Strength.strong) => solver.hasEditVariable(): true', () => {
      solver.addEditVariable(variable, kiwi.Strength.strong);
      // assert(solver.hasEditVariable(variable));
      expect(solver.hasEditVariable(variable)).toBeTruthy();
    });
    it('solver.suggestValue(variable, 200) => value: 200', function () {
      solver.suggestValue(variable, 200);
      solver.updateVariables();
      // assert.equal(200, variable.value());
      expect(variable.value()).toBe(200);
    });
    it('solver.removeEditVariable(variable) => solver.hasEditVariable(): false', () => {
      // assert(solver.hasEditVariable(variable));
      solver.removeEditVariable(variable);
      // assert(!solver.hasEditVariable(variable));
      expect(!solver.hasEditVariable(variable)).toBeTruthy();
    });
    it('solver.addEditVariable(variable) => throw exception: "duplicate edit variable"', () => {
      // assert(!solver.hasEditVariable(variable));
      expect(!solver.hasEditVariable(variable)).toBeTruthy();
      solver.addEditVariable(variable, kiwi.Strength.strong);
      // assert(solver.hasEditVariable(variable));
      expect(solver.hasEditVariable(variable)).toBeTruthy();
      try {
        solver.addEditVariable(variable, kiwi.Strength.strong);
        // assert(false);
        expect(false).toBeTruthy();
      } catch (err) {
        // assert.equal(err.message, "duplicate edit variable");
        expect(err.message).toBe('duplicate edit variable');
      }
    });
    it('solver.addEditVariable(variable) => throw exception: "unknown edit variable"', () => {
      // assert(solver.hasEditVariable(variable));
      expect(solver.hasEditVariable(variable)).toBeTruthy();
      solver.removeEditVariable(variable);
      // assert(!solver.hasEditVariable(variable));
      expect(!solver.hasEditVariable(variable)).toBeTruthy();
      try {
        solver.removeEditVariable(variable);
        // assert(false);
        expect(false).toBeTruthy();
      } catch (err) {
        // assert.equal(err.message, "unknown edit variable");
        expect(err.message).toBe('unknown edit variable');
      }
    });
  });

  describe('Expression', () => {
    it('new Expression()', () => {
      // assert(new kiwi.Expression());
      expect(new kiwi.Expression()).toBeTruthy();
    });
    it('new Expression(variable)', () => {
      // assert(new kiwi.Expression(new kiwi.Variable()));
      expect(new kiwi.Expression(new kiwi.Variable())).toBeTruthy();
    });
    it('new Expression([-1, new Variable()])', () => {
      // assert(new kiwi.Expression([-1, new kiwi.Variable()]));
      expect(new kiwi.Expression([-1, new kiwi.Variable()])).toBeTruthy();
    });
    it('new Expression([variable, -1]) => throw exception: "array item 0 must be a number"', () => {
      try {
        new kiwi.Expression([new kiwi.Variable(), -1]);
        // assert(false);
        expect(false).toBeTruthy();
      } catch (err) {
        // assert.equal(err.message, "array item 0 must be a number");
        expect(err.message).toBe('array item 0 must be a number');
      }
    });
    it('new Expression([-1, 100]) => throw exception: "array item 1 must be a variable or expression"', () => {
      try {
        new kiwi.Expression([-1, 100]);
        // assert(false);
        expect(false).toBeTruthy();
      } catch (err) {
        // assert.equal(
        //   err.message,
        //   "array item 1 must be a variable or expression"
        // );
        expect(err.message).toBe(
          'array item 1 must be a variable or expression'
        );
      }
    });
    it('new Expression(10, 20, 30, 40) => constant: 100', () => {
      // assert.equal(new kiwi.Expression(10, 20, 30, 40).constant(), 100);
      expect(new kiwi.Expression(10, 20, 30, 40).constant()).toBe(100);
    });
    it('new Expression([-1, new Expression(10)]) => constant: -10', () => {
      // assert.equal(
      //   new kiwi.Expression([-1, new kiwi.Expression(10)]).constant(),
      //   -10
      // );
      expect(
        new kiwi.Expression([-1, new kiwi.Expression(10)]).constant()
      ).toBe(-10);
    });
    it('new Expression(new Expression(10), new Expression(20)) => constant: 30', () => {
      // assert.equal(
      //   new kiwi.Expression(
      //     new kiwi.Expression(10),
      //     new kiwi.Expression(20)
      //   ).constant(),
      //   30
      // );

      expect(
        new kiwi.Expression(
          new kiwi.Expression(10),
          new kiwi.Expression(20)
        ).constant()
      ).toBe(30);
    });
    it('new Expression(20, [0.5, new Expression(10), -10]) => constant: 15', () => {
      // assert.equal(
      //   new kiwi.Expression(20, [0.5, new kiwi.Expression(10)], -10).constant(),
      //   15
      // );

      expect(
        new kiwi.Expression(20, [0.5, new kiwi.Expression(10)], -10).constant()
      ).toBe(15);
    });
  });

  describe('Constraint', () => {
    var solver = new kiwi.Solver();
    // var vars = {};
    it('new Constraint(expr, ...) == constraint.expression()', () => {
      var expr = new kiwi.Expression(10);
      var cn = new kiwi.Constraint(expr, kiwi.Operator.Eq);
      // assert.equal(cn.expression(), expr);
      expect(cn.expression()).toBe(expr);
    });
    it('new Constraint(..., Operator.Ge, ...) == constraint.op()', function () {
      var cn = new kiwi.Constraint(new kiwi.Expression(10), kiwi.Operator.Ge);
      // assert.equal(cn.op(), kiwi.Operator.Ge);
      expect(cn.op()).toBe(kiwi.Operator.Ge);
    });
    it('new Constraint(..., ..., ..., Strength.medium) == constraint.strength()', function () {
      var cn = new kiwi.Constraint(
        new kiwi.Expression(10),
        kiwi.Operator.Le,
        undefined,
        kiwi.Strength.medium
      );
      // assert.equal(cn.strength(), kiwi.Strength.medium);
      expect(cn.strength()).toBe(kiwi.Strength.medium);
    });
    it('Optional strength => constraint.strength(): Strength.required', function () {
      var cn = new kiwi.Constraint(new kiwi.Expression(1), kiwi.Operator.Eq);
      // assert.equal(
      expect(cn.strength()).toBe(kiwi.Strength.required);
    });
    it('solver.addConstraint() => solver.hasConstraint(): true', function () {
      var cn = new kiwi.Constraint(
        new kiwi.Expression(1, -1),
        kiwi.Operator.Eq
      );
      // assert(!solver.hasConstraint(cn));
      expect(!solver.hasConstraint(cn)).toBeTruthy();
      solver.addConstraint(cn);
      // assert(solver.hasConstraint(cn));
      expect(solver.hasConstraint(cn)).toBeTruthy();
    });
    it('solver.removeConstraint() => solver.hasConstraint(): false', function () {
      var cn = new kiwi.Constraint(
        new kiwi.Expression(1, -1),
        kiwi.Operator.Eq
      );
      // assert(!solver.hasConstraint(cn));
      expect(!solver.hasConstraint(cn)).toBeTruthy();
      solver.addConstraint(cn);
      // assert(solver.hasConstraint(cn));
      expect(solver.hasConstraint(cn)).toBeTruthy();
      solver.removeConstraint(cn);
      // assert(!solver.hasConstraint(cn));
      expect(!solver.hasConstraint(cn)).toBeTruthy();
    });
    it('solver.addConstraint() 2x => throw exception: "duplicate constraint"', () => {
      var cn = new kiwi.Constraint(
        new kiwi.Expression(1, -1),
        kiwi.Operator.Eq
      );
      solver.addConstraint(cn);
      try {
        solver.addConstraint(cn);
        // assert(false);
        expect(false).toBeTruthy();
      } catch (err) {
        // assert.equal(err.message, "duplicate constraint");
        expect(err.message).toBe('duplicate constraint');
      }
    });
    it('solver.addConstraint() 2x => throw exception: "unsatisfiable constraint"', function () {
      // a constraint consisting of all numbers which are not 0
      var cn = new kiwi.Constraint(
        new kiwi.Expression(1, -1, 10),
        kiwi.Operator.Eq
      );
      try {
        solver.addConstraint(cn);
        // assert(false);
        expect(false).toBeTruthy();
      } catch (err) {
        // assert.equal(err.message, "unsatisfiable constraint");
        expect(err.message).toBe('unsatisfiable constraint');
      }
    });
    it('solver.addConstraint() 2x => throw exception: "unsatisfiable constraint"', function () {
      solver = new kiwi.Solver();
      var width = new kiwi.Variable();
      var width2 = new kiwi.Variable();
      var cn = new kiwi.Constraint(
        new kiwi.Expression(width, 100),
        kiwi.Operator.Eq
      );
      solver.addConstraint(cn);
      cn = new kiwi.Constraint(
        new kiwi.Expression(width2, 100),
        kiwi.Operator.Eq
      );
      solver.addConstraint(cn);
      try {
        cn = new kiwi.Constraint(
          new kiwi.Expression(width, width2),
          kiwi.Operator.Eq
        );
        solver.addConstraint(cn);
        // assert(false);
        expect(false).toBeTruthy();
      } catch (err) {
        // assert.equal(err.message, "unsatisfiable constraint");
        expect(err.message).toBe('unsatisfiable constraint');
      }
    });
  });

  describe('Constraint raw syntax: (expr, operator, undefined, strength)', () => {
    var solver = new kiwi.Solver();
    var vars = {
      left: new kiwi.Variable(),
      right: new kiwi.Variable(),
      width: new kiwi.Variable(),
      centerX: new kiwi.Variable(),
    };
    it('Constant left constraint (10)', () => {
      // vars.left = new kiwi.Variable();
      var left = new kiwi.Constraint(
        new kiwi.Expression([-1, vars.left], 10),
        kiwi.Operator.Eq
      );
      solver.addConstraint(left);
      solver.updateVariables();
      // assert.equal(vars.left.value(), 10);
      expect(vars.left.value()).toBe(10);
    });
    it('Width edit variable (200)', function () {
      // vars.width = new kiwi.Variable();
      solver.addEditVariable(vars.width, kiwi.Strength.strong);
      solver.suggestValue(vars.width, 200);
      solver.updateVariables();
      // assert.equal(vars.width.value(), 200);
      expect(vars.width.value()).toBe(200);
    });
    it('Right === left + width (210)', function () {
      // vars.right = new kiwi.Variable();
      var right = new kiwi.Constraint(
        new kiwi.Expression([-1, vars.right], vars.left, vars.width),
        kiwi.Operator.Eq
      );
      solver.addConstraint(right);
      solver.updateVariables();
      // assert.equal(vars.right.value(), 210);
      expect(vars.right.value()).toBe(210);
    });
    it('centerX === left + (width / 2) (110)', function () {
      // vars.centerX = new kiwi.Variable();
      var centerX = new kiwi.Constraint(
        new kiwi.Expression([-1, vars.centerX], vars.left, [0.5, vars.width]),
        kiwi.Operator.Eq
      );
      solver.addConstraint(centerX);
      solver.updateVariables();
      // assert.equal(vars.centerX.value(), 110);
      expect(vars.centerX.value()).toBe(110);
    });
  });

  describe('Constraint new syntax: (lhs, operator, rhs, strength)', function () {
    var solver = new kiwi.Solver();
    var left = new kiwi.Variable();
    var width = new kiwi.Variable();
    var top = new kiwi.Variable();
    var height = new kiwi.Variable();
    var right = new kiwi.Variable();
    var bottom = new kiwi.Variable();
    var centerX = new kiwi.Variable();
    var leftOfCenterX = new kiwi.Variable();
    solver.addEditVariable(left, kiwi.Strength.strong);
    solver.addEditVariable(width, kiwi.Strength.strong);
    solver.addEditVariable(top, kiwi.Strength.strong);
    solver.addEditVariable(height, kiwi.Strength.strong);
    solver.suggestValue(left, 0);
    solver.suggestValue(width, 500);
    solver.suggestValue(top, 0);
    solver.suggestValue(height, 300);
    it('right == left.plus(width) => 500', function () {
      solver.addConstraint(
        new kiwi.Constraint(right, kiwi.Operator.Eq, left.plus(width))
      );
      solver.updateVariables();
      // assert.equal(right.value(), 500);
      expect(right.value()).toBe(500);
    });
    it('centerX == left.plus(width.divide(2)) => 250', function () {
      solver.addConstraint(
        new kiwi.Constraint(
          centerX,
          kiwi.Operator.Eq,
          left.plus(width.divide(2))
        )
      );
      solver.updateVariables();
      // assert.equal(centerX.value(), 250);
      expect(centerX.value()).toBe(250);
    });
    it('leftOfCenterX == left.plus(width.divide(2)).minus(10) => 240', function () {
      solver.addConstraint(
        new kiwi.Constraint(
          leftOfCenterX,
          kiwi.Operator.Eq,
          left.plus(width.divide(2)).minus(10)
        )
      );
      solver.updateVariables();
      // assert.equal(leftOfCenterX.value(), 240);
      expect(leftOfCenterX.value()).toBe(240);
    });
    it('createConstraint(bottom, Operator.Eq, top.plus(height)) => 300', function () {
      solver.createConstraint(bottom, kiwi.Operator.Eq, top.plus(height));
      solver.updateVariables();
      // assert.equal(bottom.value(), 300);
      expect(bottom.value()).toBe(300);
    });
  });
});
