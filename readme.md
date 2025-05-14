        // Helper function to handle circular structures in JSON.stringify
        const getCircularReplacer = () => {
          const seen = new WeakSet();
          return (key: string, value: any) => {
            // React Hook Form errors often have a 'ref' to the DOM element
            if (key === 'ref' && value instanceof HTMLElement) {
              return `[HTMLElement: ${value.tagName}]`; // Or simply undefined
            }
            if (typeof value === 'object' && value !== null) {
              if (seen.has(value)) {
                return '[Circular]';
              }
              seen.add(value);
            }
            return value;
          };
        };
