import sys
import os

def run():
    generators_dir = r"c:\Users\priya\Downloads\customer-registry-main (1)\doc_generators"
    sys.path.append(generators_dir)
    import generate_and_organize
    generate_and_organize.generate_all_organized()

if __name__ == "__main__":
    run()
