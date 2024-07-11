import time
import argparse
from helpers import ask_data_agent, compare_usd_values, extract_agent_usd_value
from config import coins, price_prompts, mcap_prompts, price_error_tolerance, mcap_error_tolerance, loop_delay
from adapters.coingecko_adapter import CoingeckoAdapter
from adapters.defillama_adapter import DefillamaAdapter

all_adapters = [
    DefillamaAdapter(),
    CoingeckoAdapter()
]

parser = argparse.ArgumentParser(description="Specify the type of prompts to use (price or mcap).")
parser.add_argument('type', choices=['price', 'mcap'], help="Type of prompts to use")
args = parser.parse_args()

benchmark_type = args.type

if benchmark_type == 'price':
    prompts = price_prompts
    error_tolerance = price_error_tolerance
elif benchmark_type == 'mcap':
    prompts = mcap_prompts
    error_tolerance = mcap_error_tolerance

total_checks = 0
failures = []

try:
    print()
    for prompt in prompts:
        for coin in coins:
            coingecko_id = coin["coingecko_id"]
            for name_variation in coin["name_variations"]:
                agent_prompt = prompt.format(name_variation)
                print(f"{agent_prompt}")
                try:
                    agent_response = ask_data_agent(prompt.format(name_variation))
                    time.sleep(loop_delay) # the agent gets rate limitted by coingecko if we call it too fast
                    agent_usd_value = extract_agent_usd_value(agent_response)
                    print(f"{agent_usd_value}")
                except:
                    result = f"FAIL DataAgent: {agent_prompt}"
                    print(result)
                    print()
                    total_checks += 1
                    failures.append(result)
                    continue

                for adapter in all_adapters:
                    try:
                        if benchmark_type == "price" and adapter.has_get_price():
                            benchmark_value = adapter.get_price(coingecko_id)
                        elif benchmark_type == "mcap" and adapter.has_get_marketcap():
                            benchmark_value = adapter.get_marketcap(coingecko_id)
                        result = compare_usd_values(agent_usd_value, adapter, coingecko_id, name_variation, benchmark_value, error_tolerance, failures)
                    except:
                        result = f"FAIL {adapter.name}: {coingecko_id}"
                        failures.append(result)

                    print(result)
                    total_checks += 1
                print()

    # Summarize Results
    passed_checks = total_checks - len(failures)
    print()
    print(f"{passed_checks} / {total_checks} Benchmarks passed")

    if len(failures) > 0:
        print("Failures:")
        for failure in failures:
            print(failure)

except Exception as e:
    print(f"Unexpected error: {e}")
    exit(1)
