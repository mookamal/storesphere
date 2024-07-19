'use client';

import { useEffect } from 'react';

function BootstrapJS() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      require('bootstrap/dist/js/bootstrap.bundle.min.js');
    }
  }, []);

  return null;
}

export default BootstrapJS;
