#include <stdio.h>
#include "main.h"


int main(void)
{
	char *ptc = "abcdefghijklmnopqrstuvwxyz";

	printf("%d\n", is_pangram(ptc));

	return (0);
}
