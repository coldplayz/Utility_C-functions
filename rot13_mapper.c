#include <stdio.h>
#include "main.h"

/**
 * rot13_map - encodes with rot13 encryption
 * @c: char to possibly encode
 */
void rot13_map(char *c)
{
	char rot13_one[53] = {'a', 'A', 'b', 'B', 'c', 'C', 'd', 'D', 'e', 'E',
		'f', 'F', 'g', 'G', 'h', 'H', 'i', 'I', 'j', 'J', 'k', 'K',
		'l', 'L', 'm', 'M', 'n', 'N', 'o', 'O', 'p', 'P', 'q', 'Q',
		'r', 'R', 's', 'S', 't', 'T', 'u', 'U', 'v', 'V', 'w', 'W',
		'x', 'X', 'y', 'Y', 'z', 'Z'};
	char rot13_two[53] = {'n', 'N', 'o', 'O', 'p', 'P', 'q', 'Q', 'r', 'R',
		's', 'S', 't', 'T', 'u', 'U', 'v', 'V', 'w', 'W', 'x', 'X',
		'y', 'Y', 'z', 'Z', 'a', 'A', 'b', 'B', 'c', 'C', 'd', 'D',
		'e', 'E', 'f', 'F', 'g', 'G', 'h', 'H', 'i', 'I', 'j', 'J',
		'k', 'K', 'l', 'L', 'm', 'M'};
	int i;

	for (i = 0; i < 53; i++)
	{
		if (*c == rot13_one[i])
		{
			*c = rot13_two[i];
			return;
		}
	}
}
