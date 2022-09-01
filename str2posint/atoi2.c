#include "main.h"

/**
 * _atoi2 - converts character constants from
 * 0 to 9 to actual integers
 * @c: a character constant of form '0' to '9'
 *
 * Return: an integer
 */
int _atoi2(char c)
{
	int i;

	for (i = 0; i < 10; i++)
	{
		if (c == (i + '0'))
		{
			return (i);
		}
	}
}
