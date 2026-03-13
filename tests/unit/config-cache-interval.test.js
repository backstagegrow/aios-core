describe('config-cache interval lifecycle', () => {
  afterEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
  });

  it('unrefs the core config-cache cleanup interval', () => {
    const unref = jest.fn();
    jest.spyOn(global, 'setInterval').mockReturnValue({ unref });

    jest.isolateModules(() => {
      require('../../.aios-core/core/config/config-cache');
    });

    expect(unref).toHaveBeenCalled();
  });

  it('unrefs the infrastructure config-cache cleanup interval', () => {
    const unref = jest.fn();
    jest.spyOn(global, 'setInterval').mockReturnValue({ unref });

    jest.isolateModules(() => {
      require('../../.aios-core/infrastructure/scripts/config-cache');
    });

    expect(unref).toHaveBeenCalled();
  });
});
